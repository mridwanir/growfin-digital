import type { orders } from '@/db/schema/orders'
import type { PackageTier, Tenant } from '@/db/schema/tenants'

export interface CreateSnapTransactionParams {
  orderId: string
  grossAmount: number
  customerDetails?: {
    email?: string
    firstName?: string
    lastName?: string
    phone?: string
  }
}

export interface SnapTransactionResponse {
  token: string
  redirectUrl: string
}

export interface MidtransStatusResponse {
  status_code: string
  status_message?: string
  transaction_id?: string
  order_id: string
  gross_amount?: string
  payment_type?: string
  transaction_time?: string
  transaction_status: string
  fraud_status?: string
  signature_key?: string
}

export interface ActivateOrderAndTenantParams {
  orderId: string
  paymentMethod?: string | null
  paymentGatewayRef?: string | null
  grossAmount?: number | null
}

export interface ActivationResult {
  order: typeof orders.$inferSelect
  tenant: Tenant
  alreadyPaid: boolean
}

export interface InvoiceEmailParams {
  toEmail?: string
  userId?: string | null
  businessName: string
  orderId: string
  paidAt?: Date | string
  amount: number
  packageTier?: string | null
  paymentMethod?: string | null
  slug: string
}

export interface CreateCheckoutSessionParams {
  slug: string
  amount?: number
  packageTier?: string
  userId?: string
  cookieHeader?: string | null
}

export type CreateCheckoutSessionResult =
  | {
      orderId: string
      redirectUrl: string
      success: true
      token: string
    }
  | {
      error: string
      status: number
      success: false
    }

export type VerifyCheckoutResult =
  | {
      alreadyPaid?: boolean
      error?: string
      orderId: string
      paymentGatewayRef?: string | null
      paymentMethod?: string | null
      status: string
      success: boolean
      tenantId: string
      tenantSlug: string
    }
  | {
      error: string
      status: number
      success: false
    }

export interface MidtransNotificationPayload {
  order_id?: string
  status_code?: string
  gross_amount?: string
  signature_key?: string
  transaction_status?: string
  fraud_status?: string
  payment_type?: string
  transaction_id?: string
  [key: string]: unknown
}

export interface MidtransNotificationResult {
  message?: string
  error?: string
  status: number
}

export type { PackageTier }
