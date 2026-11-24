import type {
  CreateSnapTransactionParams,
  MidtransStatusResponse,
  SnapTransactionResponse,
} from './types'

import crypto from 'node:crypto'

import { env } from '@/lib/env'

import 'server-only'

const MIDTRANS_SNAP_PRODUCTION_URL = 'https://app.midtrans.com/snap/v1/transactions'
const MIDTRANS_SNAP_SANDBOX_URL = 'https://app.sandbox.midtrans.com/snap/v1/transactions'

const MIDTRANS_STATUS_PRODUCTION_URL = 'https://api.midtrans.com/v2'
const MIDTRANS_STATUS_SANDBOX_URL = 'https://api.sandbox.midtrans.com/v2'

function getBasicAuthHeader(): string {
  const serverKey = env.MIDTRANS_SERVER_KEY
  const authBuffer = Buffer.from(`${serverKey}:`).toString('base64')
  return `Basic ${authBuffer}`
}

export async function createSnapTransaction(
  params: CreateSnapTransactionParams,
): Promise<SnapTransactionResponse> {
  const isProd = process.env.NODE_ENV === 'production'
  const endpoint = isProd ? MIDTRANS_SNAP_PRODUCTION_URL : MIDTRANS_SNAP_SANDBOX_URL

  const payload = {
    customer_details: params.customerDetails,
    transaction_details: {
      gross_amount: Math.round(params.grossAmount),
      order_id: params.orderId,
    },
  }

  const response = await fetch(endpoint, {
    body: JSON.stringify(payload),
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: getBasicAuthHeader(),
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorBody = await response.text()
    console.error('[Midtrans Snap Error]:', {
      body: errorBody,
      status: response.status,
    })
    throw new Error(
      `Midtrans Snap transaction failed with status ${response.status}: ${errorBody || response.statusText}`,
    )
  }

  const data = (await response.json()) as { redirect_url: string; token: string }

  return {
    redirectUrl: data.redirect_url,
    token: data.token,
  }
}

export async function fetchMidtransStatus(orderId: string): Promise<MidtransStatusResponse> {
  const isProd = process.env.NODE_ENV === 'production'
  const baseUrl = isProd ? MIDTRANS_STATUS_PRODUCTION_URL : MIDTRANS_STATUS_SANDBOX_URL
  const endpoint = `${baseUrl}/${encodeURIComponent(orderId)}/status`

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: getBasicAuthHeader(),
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorBody = await response.text()
    console.error('[Midtrans Status Error]:', {
      body: errorBody,
      status: response.status,
    })
    throw new Error(
      `Midtrans Status fetch failed with status ${response.status}: ${errorBody || response.statusText}`,
    )
  }

  return (await response.json()) as MidtransStatusResponse
}

export function verifyMidtransSignature({
  grossAmount,
  orderId,
  receivedSignature,
  serverKey = env.MIDTRANS_SERVER_KEY,
  statusCode,
}: {
  grossAmount: string
  orderId: string
  receivedSignature: string
  serverKey?: string
  statusCode: string
}): boolean {
  if (!orderId || !statusCode || !grossAmount || !receivedSignature) {
    return false
  }

  const rawPayload = `${orderId}${statusCode}${grossAmount}${serverKey}`
  const calculatedSignature = crypto.createHash('sha512').update(rawPayload).digest('hex')

  const receivedBuffer = Buffer.from(receivedSignature, 'hex')
  const calculatedBuffer = Buffer.from(calculatedSignature, 'hex')

  if (receivedBuffer.length !== calculatedBuffer.length) {
    return false
  }

  return crypto.timingSafeEqual(receivedBuffer, calculatedBuffer)
}

export function isSettlementOrAccept(status: {
  fraud_status?: string
  transaction_status: string
}): boolean {
  const { transaction_status, fraud_status } = status

  if (transaction_status === 'settlement') {
    return true
  }

  if (transaction_status === 'capture' && fraud_status === 'accept') {
    return true
  }

  return false
}
