import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
// @ts-ignore TS5097: Node test runner requires .ts extension under native strip-types
import { validatePaymentStatus, verifyPayment, type MidtransStatusResponse } from '../payment-verification.ts';

describe('Payment Verification Seam', () => {
  describe('validatePaymentStatus', () => {
    it('accepts settlement status as valid payment', () => {
      const response: MidtransStatusResponse = {
        transaction_status: 'settlement',
        payment_type: 'qris',
        transaction_id: 'mt-trx-001',
      };
      const result = validatePaymentStatus(response);
      assert.equal(result.isValid, true);
      assert.equal(result.status, 'settlement');
    });

    it('accepts capture status with accept fraud_status as valid payment', () => {
      const response: MidtransStatusResponse = {
        transaction_status: 'capture',
        fraud_status: 'accept',
        payment_type: 'credit_card',
        transaction_id: 'mt-trx-002',
      };
      const result = validatePaymentStatus(response);
      assert.equal(result.isValid, true);
      assert.equal(result.status, 'capture');
    });

    it('rejects capture status with challenge fraud_status', () => {
      const response: MidtransStatusResponse = {
        transaction_status: 'capture',
        fraud_status: 'challenge',
        payment_type: 'credit_card',
        transaction_id: 'mt-trx-003',
      };
      const result = validatePaymentStatus(response);
      assert.equal(result.isValid, false);
      assert.equal(result.status, 'challenge');
      assert.equal(result.httpStatus, 400);
      assert.match(result.message || '', /challenge/i);
    });

    it('rejects pending status with 400 httpStatus', () => {
      const response: MidtransStatusResponse = {
        transaction_status: 'pending',
        payment_type: 'bank_transfer',
        transaction_id: 'mt-trx-004',
      };
      const result = validatePaymentStatus(response);
      assert.equal(result.isValid, false);
      assert.equal(result.status, 'pending');
      assert.equal(result.httpStatus, 400);
      assert.match(result.message || '', /pending/i);
    });

    it('rejects deny status with 400 httpStatus', () => {
      const response: MidtransStatusResponse = {
        transaction_status: 'deny',
        payment_type: 'credit_card',
        transaction_id: 'mt-trx-005',
      };
      const result = validatePaymentStatus(response);
      assert.equal(result.isValid, false);
      assert.equal(result.status, 'deny');
      assert.equal(result.httpStatus, 400);
      assert.match(result.message || '', /denied/i);
    });

    it('rejects cancel status with 400 httpStatus', () => {
      const response: MidtransStatusResponse = {
        transaction_status: 'cancel',
        payment_type: 'qris',
        transaction_id: 'mt-trx-006',
      };
      const result = validatePaymentStatus(response);
      assert.equal(result.isValid, false);
      assert.equal(result.status, 'cancel');
      assert.equal(result.httpStatus, 400);
      assert.match(result.message || '', /cancelled/i);
    });

    it('rejects expire status with 400 httpStatus', () => {
      const response: MidtransStatusResponse = {
        transaction_status: 'expire',
        payment_type: 'bank_transfer',
        transaction_id: 'mt-trx-007',
      };
      const result = validatePaymentStatus(response);
      assert.equal(result.isValid, false);
      assert.equal(result.status, 'expire');
      assert.equal(result.httpStatus, 400);
      assert.match(result.message || '', /expired/i);
    });

    it('rejects empty or missing response', () => {
      const result = validatePaymentStatus(null);
      assert.equal(result.isValid, false);
      assert.equal(result.status, 'unknown');
      assert.equal(result.httpStatus, 400);
    });
  });

  describe('verifyPayment Workflow', () => {
    const defaultInput = {
      order_id: 'order-123',
      slug: 'my-business-demo',
      payment_method: 'client-hint-qris',
      payment_gateway_ref: 'client-hint-ref',
    };

    it('idempotency: exits immediately if transaction is already paid without calling Midtrans', async () => {
      let midtransCalled = false;
      let onVerifiedCalled = false;

      const result = await verifyPayment(defaultInput, {
        fetchExistingTransaction: async () => ({
          id: 'order-123',
          status: 'paid',
          user_id: 'user-001',
          snapshot_tier: 'pro-basic',
          amount: 150000,
        }),
        fetchMidtransStatus: async () => {
          midtransCalled = true;
          return { transaction_status: 'settlement' };
        },
        onPaymentVerified: async () => {
          onVerifiedCalled = true;
        },
      });

      assert.equal(result.success, true);
      assert.equal(result.message, 'Transaction already paid');
      assert.equal(midtransCalled, false, 'Midtrans API must not be called when already paid');
      assert.equal(onVerifiedCalled, false, 'Activation workflow must not be called when already paid');
    });

    it('rejects when transaction does not exist in database', async () => {
      let midtransCalled = false;

      const result = await verifyPayment(defaultInput, {
        fetchExistingTransaction: async () => null,
        fetchMidtransStatus: async () => {
          midtransCalled = true;
          return { transaction_status: 'settlement' };
        },
        onPaymentVerified: async () => {},
      });

      assert.equal(result.success, false);
      assert.equal(result.httpStatus, 404);
      assert.match(result.error || '', /Transaction not found/i);
      assert.equal(midtransCalled, false);
    });

    interface CapturedPayload {
      order_id: string;
      slug: string;
      payment_method?: string;
      payment_gateway_ref?: string;
    }

    it('successfully transitions to paid and publishes when Midtrans reports settlement', async () => {
      let capturedPayload: CapturedPayload | undefined;

      const result = await verifyPayment(defaultInput, {
        fetchExistingTransaction: async () => ({
          id: 'order-123',
          status: 'pending',
          user_id: 'user-001',
          snapshot_tier: 'pro-basic',
          amount: 150000,
        }),
        fetchMidtransStatus: async () => ({
          transaction_status: 'settlement',
          payment_type: 'qris',
          transaction_id: 'mt-settled-999',
        }),
        onPaymentVerified: async (payload) => {
          capturedPayload = {
            order_id: payload.order_id,
            slug: payload.slug,
            payment_method: payload.payment_method,
            payment_gateway_ref: payload.payment_gateway_ref,
          };
          return { published: true };
        },
      });

      assert.equal(result.success, true);
      assert.ok(capturedPayload);
      const verified: CapturedPayload = capturedPayload;
      assert.equal(verified.order_id, 'order-123');
      assert.equal(verified.slug, 'my-business-demo');
      assert.equal(verified.payment_method, 'qris');
      assert.equal(verified.payment_gateway_ref, 'mt-settled-999');
    });

    it('successfully transitions to paid when Midtrans reports capture with accept fraud status', async () => {
      let capturedPayload: CapturedPayload | undefined;

      const result = await verifyPayment(defaultInput, {
        fetchExistingTransaction: async () => ({
          id: 'order-123',
          status: 'pending',
          user_id: 'user-001',
          snapshot_tier: 'pro-basic',
          amount: 150000,
        }),
        fetchMidtransStatus: async () => ({
          transaction_status: 'capture',
          fraud_status: 'accept',
          payment_type: 'credit_card',
          transaction_id: 'mt-cc-888',
        }),
        onPaymentVerified: async (payload) => {
          capturedPayload = {
            order_id: payload.order_id,
            slug: payload.slug,
            payment_method: payload.payment_method,
            payment_gateway_ref: payload.payment_gateway_ref,
          };
          return { published: true };
        },
      });

      assert.equal(result.success, true);
      assert.ok(capturedPayload);
      const verified: CapturedPayload = capturedPayload;
      assert.equal(verified.payment_method, 'credit_card');
      assert.equal(verified.payment_gateway_ref, 'mt-cc-888');
    });
    it('rejects activation when Midtrans reports pending', async () => {
      let onVerifiedCalled = false;

      const result = await verifyPayment(defaultInput, {
        fetchExistingTransaction: async () => ({
          id: 'order-123',
          status: 'pending',
        }),
        fetchMidtransStatus: async () => ({
          transaction_status: 'pending',
          payment_type: 'bank_transfer',
          transaction_id: 'mt-pending-111',
        }),
        onPaymentVerified: async () => {
          onVerifiedCalled = true;
        },
      });

      assert.equal(result.success, false);
      assert.equal(result.status, 'pending');
      assert.equal(result.httpStatus, 400);
      assert.match(result.error || '', /pending/i);
      assert.equal(onVerifiedCalled, false, 'Activation must not be performed on pending');
    });

    it('rejects activation when Midtrans reports deny', async () => {
      let onVerifiedCalled = false;

      const result = await verifyPayment(defaultInput, {
        fetchExistingTransaction: async () => ({
          id: 'order-123',
          status: 'pending',
        }),
        fetchMidtransStatus: async () => ({
          transaction_status: 'deny',
          payment_type: 'credit_card',
          transaction_id: 'mt-deny-222',
        }),
        onPaymentVerified: async () => {
          onVerifiedCalled = true;
        },
      });

      assert.equal(result.success, false);
      assert.equal(result.status, 'deny');
      assert.equal(result.httpStatus, 400);
      assert.match(result.error || '', /denied/i);
      assert.equal(onVerifiedCalled, false, 'Activation must not be performed on deny');
    });

    it('rejects activation when Midtrans reports expire', async () => {
      let onVerifiedCalled = false;

      const result = await verifyPayment(defaultInput, {
        fetchExistingTransaction: async () => ({
          id: 'order-123',
          status: 'pending',
        }),
        fetchMidtransStatus: async () => ({
          transaction_status: 'expire',
          payment_type: 'bank_transfer',
          transaction_id: 'mt-expire-333',
        }),
        onPaymentVerified: async () => {
          onVerifiedCalled = true;
        },
      });

      assert.equal(result.success, false);
      assert.equal(result.status, 'expire');
      assert.equal(result.httpStatus, 400);
      assert.match(result.error || '', /expired/i);
      assert.equal(onVerifiedCalled, false, 'Activation must not be performed on expire');
    });

    it('rejects activation when Midtrans reports cancel', async () => {
      let onVerifiedCalled = false;

      const result = await verifyPayment(defaultInput, {
        fetchExistingTransaction: async () => ({
          id: 'order-123',
          status: 'pending',
        }),
        fetchMidtransStatus: async () => ({
          transaction_status: 'cancel',
          payment_type: 'qris',
          transaction_id: 'mt-cancel-444',
        }),
        onPaymentVerified: async () => {
          onVerifiedCalled = true;
        },
      });

      assert.equal(result.success, false);
      assert.equal(result.status, 'cancel');
      assert.equal(result.httpStatus, 400);
      assert.match(result.error || '', /cancelled/i);
      assert.equal(onVerifiedCalled, false, 'Activation must not be performed on cancel');
    });

    it('rejects activation when Midtrans reports fraud challenge on capture', async () => {
      let onVerifiedCalled = false;

      const result = await verifyPayment(defaultInput, {
        fetchExistingTransaction: async () => ({
          id: 'order-123',
          status: 'pending',
        }),
        fetchMidtransStatus: async () => ({
          transaction_status: 'capture',
          fraud_status: 'challenge',
          payment_type: 'credit_card',
          transaction_id: 'mt-challenge-555',
        }),
        onPaymentVerified: async () => {
          onVerifiedCalled = true;
        },
      });

      assert.equal(result.success, false);
      assert.equal(result.status, 'challenge');
      assert.equal(result.httpStatus, 400);
      assert.match(result.error || '', /challenge/i);
      assert.equal(onVerifiedCalled, false, 'Activation must not be performed on fraud challenge');
    });
  });
});
