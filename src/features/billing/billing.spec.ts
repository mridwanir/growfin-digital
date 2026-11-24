import crypto from 'node:crypto'
import { describe, expect, it, vi } from 'vitest'

import { isSettlementOrAccept, normalizePackageTier, verifyMidtransSignature } from './server'

vi.mock('server-only', () => ({}))

describe('Billing feature slice - domain unit logic', () => {
  describe('normalizePackageTier', () => {
    it('normalizes tier names properly', () => {
      expect(normalizePackageTier('pro')).toBe('pro')
      expect(normalizePackageTier('enterprise')).toBe('pro')
      expect(normalizePackageTier('pro_annual')).toBe('pro')
      expect(normalizePackageTier('instant')).toBe('instant')
      expect(normalizePackageTier('instan')).toBe('instant')
      expect(normalizePackageTier('free')).toBe('free')
      expect(normalizePackageTier('free_trial')).toBe('free')
      expect(normalizePackageTier(null)).toBe('instant')
      expect(normalizePackageTier(undefined)).toBe('instant')
      expect(normalizePackageTier('unknown-tier')).toBe('instant')
    })
  })

  describe('verifyMidtransSignature', () => {
    const serverKey = 'test-midtrans-server-key'
    const orderId = 'ORD-12345'
    const statusCode = '200'
    const grossAmount = '299000.00'

    const generateSignature = (key = serverKey) => {
      return crypto
        .createHash('sha512')
        .update(`${orderId}${statusCode}${grossAmount}${key}`)
        .digest('hex')
    }

    it('verifies valid signature correctly', () => {
      const validSignature = generateSignature()
      expect(
        verifyMidtransSignature({
          grossAmount,
          orderId,
          receivedSignature: validSignature,
          serverKey,
          statusCode,
        }),
      ).toBe(true)
    })

    it('rejects tampered or forged signature', () => {
      expect(
        verifyMidtransSignature({
          grossAmount,
          orderId,
          receivedSignature: 'forged-signature-hex',
          serverKey,
          statusCode,
        }),
      ).toBe(false)
    })

    it('rejects signature generated with wrong server key', () => {
      const wrongKeySignature = generateSignature('wrong-server-key')
      expect(
        verifyMidtransSignature({
          grossAmount,
          orderId,
          receivedSignature: wrongKeySignature,
          serverKey,
          statusCode,
        }),
      ).toBe(false)
    })
  })

  describe('isSettlementOrAccept', () => {
    it('returns true for settlement status regardless of fraud status', () => {
      expect(
        isSettlementOrAccept({
          fraud_status: 'accept',
          transaction_status: 'settlement',
        }),
      ).toBe(true)
      expect(
        isSettlementOrAccept({
          fraud_status: undefined,
          transaction_status: 'settlement',
        }),
      ).toBe(true)
    })

    it('returns true for capture status with accept fraud status', () => {
      expect(
        isSettlementOrAccept({
          fraud_status: 'accept',
          transaction_status: 'capture',
        }),
      ).toBe(true)
    })

    it('returns false for capture status without accept fraud status', () => {
      expect(
        isSettlementOrAccept({
          fraud_status: 'challenge',
          transaction_status: 'capture',
        }),
      ).toBe(false)
      expect(
        isSettlementOrAccept({
          fraud_status: undefined,
          transaction_status: 'capture',
        }),
      ).toBe(false)
    })

    it('returns false for pending, cancel, deny, expire statuses', () => {
      expect(
        isSettlementOrAccept({
          fraud_status: 'accept',
          transaction_status: 'pending',
        }),
      ).toBe(false)
      expect(
        isSettlementOrAccept({
          fraud_status: 'accept',
          transaction_status: 'cancel',
        }),
      ).toBe(false)
      expect(
        isSettlementOrAccept({
          fraud_status: 'accept',
          transaction_status: 'deny',
        }),
      ).toBe(false)
      expect(
        isSettlementOrAccept({
          fraud_status: 'accept',
          transaction_status: 'expire',
        }),
      ).toBe(false)
    })
  })
})
