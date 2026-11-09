import crypto from 'node:crypto'

import { env } from '@/lib/env'

const MIDTRANS_SNAP_PRODUCTION_URL = 'https://app.midtrans.com/snap/v1/transactions'
const MIDTRANS_SNAP_SANDBOX_URL = 'https://app.sandbox.midtrans.com/snap/v1/transactions'

const MIDTRANS_STATUS_PRODUCTION_URL = 'https://api.midtrans.com/v2'
const MIDTRANS_STATUS_SANDBOX_URL = 'https://api.sandbox.midtrans.com/v2'

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

function getBasicAuthHeader(): string {
  const serverKey = env.MIDTRANS_SERVER_KEY
  return `Basic ${Buffer.from(`${serverKey}:`).toString('base64')}`
}

export async function createSnapTransaction(
  params: CreateSnapTransactionParams,
): Promise<SnapTransactionResponse> {
  const isProduction = env.MIDTRANS_IS_PRODUCTION
  const snapUrl = isProduction ? MIDTRANS_SNAP_PRODUCTION_URL : MIDTRANS_SNAP_SANDBOX_URL

  const payload = {
    credit_card: {
      secure: true,
    },
    customer_details: params.customerDetails
      ? {
          email: params.customerDetails.email,
          first_name: params.customerDetails.firstName ?? 'Growfin',
          last_name: params.customerDetails.lastName ?? 'Merchant',
          phone: params.customerDetails.phone,
        }
      : undefined,
    transaction_details: {
      gross_amount: Math.round(params.grossAmount),
      order_id: params.orderId,
    },
  }

  const response = await fetch(snapUrl, {
    body: JSON.stringify(payload),
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: getBasicAuthHeader(),
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Midtrans Snap error (${response.status}): ${errorText}`)
  }

  const data = (await response.json()) as { redirect_url: string; token: string }
  return {
    redirectUrl: data.redirect_url,
    token: data.token,
  }
}

export async function fetchMidtransStatus(orderId: string): Promise<MidtransStatusResponse> {
  const isProduction = env.MIDTRANS_IS_PRODUCTION
  const baseUrl = isProduction ? MIDTRANS_STATUS_PRODUCTION_URL : MIDTRANS_STATUS_SANDBOX_URL
  const statusUrl = `${baseUrl}/${encodeURIComponent(orderId)}/status`

  const response = await fetch(statusUrl, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: getBasicAuthHeader(),
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Midtrans Status error (${response.status}): ${errorText}`)
  }

  return (await response.json()) as MidtransStatusResponse
}

export function verifyMidtransSignature({
  orderId,
  statusCode,
  grossAmount,
  receivedSignature,
  serverKey = env.MIDTRANS_SERVER_KEY,
}: {
  grossAmount: string
  orderId: string
  receivedSignature: string
  serverKey?: string
  statusCode: string
}): boolean {
  if (!orderId || !statusCode || !grossAmount || !receivedSignature || !serverKey) {
    return false
  }

  const expectedSignature = crypto
    .createHash('sha512')
    .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
    .digest('hex')

  if (receivedSignature.length !== expectedSignature.length) {
    return false
  }

  return crypto.timingSafeEqual(
    Buffer.from(receivedSignature, 'utf-8'),
    Buffer.from(expectedSignature, 'utf-8'),
  )
}

export function isSettlementOrAccept(status: {
  fraud_status?: string | null
  transaction_status: string
}): boolean {
  if (status.transaction_status === 'settlement') {
    return true
  }
  if (status.transaction_status === 'capture') {
    return status.fraud_status === 'accept'
  }
  return false
}
