import { PACKAGE_LIMITS, PackageTier } from '@/lib/site-config';
import { sanitizeMenuItems } from '@/lib/catalog';
import type { MenuItem } from '@/lib/types';

export interface MidtransStatusResponse {
  transaction_status: string;
  fraud_status?: string;
  payment_type?: string;
  transaction_id?: string;
  order_id?: string;
  status_code?: string;
  status_message?: string;
  gross_amount?: string;
  [key: string]: unknown;
}

export interface PaymentStatusValidation {
  isValid: boolean;
  status: string;
  message?: string;
  httpStatus?: number;
}

export interface ExistingTransaction {
  id: string;
  status: string;
  user_id?: string;
  snapshot_tier?: string;
  amount?: number;
  transaction_type?: string;
  [key: string]: unknown;
}

export interface VerifyPaymentInput {
  order_id: string;
  slug: string;
  payment_method?: string;
  payment_gateway_ref?: string;
}

export interface OnPaymentVerifiedParams {
  order_id: string;
  slug: string;
  existingTrx: ExistingTransaction;
  statusResponse: MidtransStatusResponse;
  payment_method?: string;
  payment_gateway_ref?: string;
}

export interface VerifyPaymentDependencies {
  fetchExistingTransaction: (orderId: string) => Promise<ExistingTransaction | null>;
  fetchMidtransStatus: (orderId: string) => Promise<MidtransStatusResponse>;
  onPaymentVerified: (params: OnPaymentVerifiedParams) => Promise<unknown>;
}

export interface VerifyPaymentResult {
  success: boolean;
  message?: string;
  error?: string;
  status?: string;
  httpStatus?: number;
  data?: unknown;
}

/**
 * Sanitizes draft_metadata.menu according to package tier limits.
 * For tiers without advancedVariants (e.g. instan), strips imageGallery,
 * specifications, and advanced variant option fields before copying to metadata.
 */
export function sanitizeDraftMetadata<T extends Record<string, unknown>>(
  metadata: T | null | undefined,
  tier: string | undefined
): T | null | undefined {
  if (!metadata || typeof metadata !== 'object') {
    return metadata;
  }
  const packageTier = (tier && tier in PACKAGE_LIMITS ? tier : 'instan') as PackageTier;
  const tierLimits = PACKAGE_LIMITS[packageTier] || PACKAGE_LIMITS['instan'];

  const rawMenu = 'menu' in metadata && Array.isArray(metadata.menu)
    ? (metadata.menu as (Partial<MenuItem> | MenuItem)[])
    : null;

  if (!rawMenu) {
    return metadata;
  }

  const sanitizedMenu = sanitizeMenuItems(rawMenu.slice(0, tierLimits.maxProducts), {
    advancedVariants: tierLimits.advancedVariants,
  });

  return {
    ...metadata,
    menu: sanitizedMenu,
  };
}

/**
 * Validates transaction status returned by the Midtrans Status API.
 * Only 'settlement' or 'capture' with fraud_status 'accept' are considered valid paid states.
 */
export function validatePaymentStatus(statusResponse?: MidtransStatusResponse | null): PaymentStatusValidation {
  if (!statusResponse || typeof statusResponse.transaction_status !== 'string') {
    return {
      isValid: false,
      status: 'unknown',
      message: 'Invalid or missing transaction status from payment gateway',
      httpStatus: 400,
    };
  }

  const { transaction_status, fraud_status } = statusResponse;

  if (transaction_status === 'settlement') {
    return {
      isValid: true,
      status: 'settlement',
    };
  }

  if (transaction_status === 'capture') {
    if (fraud_status === 'accept') {
      return {
        isValid: true,
        status: 'capture',
      };
    }
    return {
      isValid: false,
      status: fraud_status || 'challenge',
      message: `Payment flagged with fraud status: ${fraud_status || 'challenge'}`,
      httpStatus: 400,
    };
  }

  if (transaction_status === 'pending') {
    return {
      isValid: false,
      status: 'pending',
      message: 'Payment is pending',
      httpStatus: 400,
    };
  }

  if (transaction_status === 'deny') {
    return {
      isValid: false,
      status: 'deny',
      message: 'Payment denied',
      httpStatus: 400,
    };
  }

  if (transaction_status === 'cancel') {
    return {
      isValid: false,
      status: 'cancel',
      message: 'Payment cancelled',
      httpStatus: 400,
    };
  }

  if (transaction_status === 'expire') {
    return {
      isValid: false,
      status: 'expire',
      message: 'Payment expired',
      httpStatus: 400,
    };
  }

  return {
    isValid: false,
    status: transaction_status,
    message: `Payment status not accepted: ${transaction_status}`,
    httpStatus: 400,
  };
}

/**
 * Queries the Midtrans Status API directly server-to-server using midtransClient.CoreApi.
 */
export async function fetchMidtransStatus(orderId: string): Promise<MidtransStatusResponse> {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) {
    throw new Error('Server configuration error: MIDTRANS_SERVER_KEY is not configured');
  }

  const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true';
  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const midtransClient = require('midtrans-client');
  const coreApi = new midtransClient.CoreApi({
    isProduction,
    serverKey,
    clientKey,
  });

  const response = (await coreApi.transaction.status(orderId)) as MidtransStatusResponse;
  return response;
}

/**
 * Orchestrates payment verification with idempotency check, Midtrans server status verification,
 * and business activation execution.
 */
export async function verifyPayment(
  input: VerifyPaymentInput,
  deps: VerifyPaymentDependencies
): Promise<VerifyPaymentResult> {
  const { order_id, slug, payment_method, payment_gateway_ref } = input;

  if (!order_id || !slug) {
    return {
      success: false,
      error: 'Missing required fields: order_id and slug are required',
      httpStatus: 400,
    };
  }

  // 1. Fetch current transaction status for idempotency check
  const existingTrx = await deps.fetchExistingTransaction(order_id);
  if (!existingTrx) {
    return {
      success: false,
      error: 'Transaction not found',
      httpStatus: 404,
    };
  }

  if (existingTrx.status === 'paid') {
    return {
      success: true,
      message: 'Transaction already paid',
    };
  }

  // 2. Query Midtrans Status API server-to-server
  const statusResponse = await deps.fetchMidtransStatus(order_id);

  // 3. Validate status
  const validation = validatePaymentStatus(statusResponse);
  if (!validation.isValid) {
    return {
      success: false,
      error: validation.message,
      status: validation.status,
      httpStatus: validation.httpStatus || 400,
    };
  }

  // 4. Execute activation workflows
  const data = await deps.onPaymentVerified({
    order_id,
    slug,
    existingTrx,
    statusResponse,
    payment_method: statusResponse.payment_type || payment_method,
    payment_gateway_ref: statusResponse.transaction_id || payment_gateway_ref,
  });

  return {
    success: true,
    data,
  };
}
