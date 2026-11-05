import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { GET, POST } from '../route';

describe('FOMO reminder cron authentication seam', () => {
  const originalCronSecret = process.env.CRON_SECRET;

  beforeEach(() => {
    process.env.CRON_SECRET = 'test-secret-123';
  });

  afterEach(() => {
    if (originalCronSecret !== undefined) {
      process.env.CRON_SECRET = originalCronSecret;
    } else {
      delete process.env.CRON_SECRET;
    }
  });

  it('rejects GET request with 401 when authorization header is missing', async () => {
    const req = new Request('http://localhost/api/cron/fomo-reminder', {
      method: 'GET',
    });
    const res = await GET(req);
    assert.equal(res.status, 401);
    const body = await res.json();
    assert.deepEqual(body, {
      error: 'Unauthorized: Invalid or missing CRON_SECRET token',
    });
  });

  it('rejects GET request with 401 when bearer token does not match CRON_SECRET', async () => {
    const req = new Request('http://localhost/api/cron/fomo-reminder', {
      method: 'GET',
      headers: {
        authorization: 'Bearer wrong-secret',
      },
    });
    const res = await GET(req);
    assert.equal(res.status, 401);
    const body = await res.json();
    assert.deepEqual(body, {
      error: 'Unauthorized: Invalid or missing CRON_SECRET token',
    });
  });

  it('rejects GET request with 401 when authorization scheme is not Bearer', async () => {
    const req = new Request('http://localhost/api/cron/fomo-reminder', {
      method: 'GET',
      headers: {
        authorization: 'Basic dGVzdC1zZWNyZXQtMTIz',
      },
    });
    const res = await GET(req);
    assert.equal(res.status, 401);
    const body = await res.json();
    assert.deepEqual(body, {
      error: 'Unauthorized: Invalid or missing CRON_SECRET token',
    });
  });

  it('rejects GET request with 401 when CRON_SECRET environment variable is missing', async () => {
    delete process.env.CRON_SECRET;
    const req = new Request('http://localhost/api/cron/fomo-reminder', {
      method: 'GET',
      headers: {
        authorization: 'Bearer test-secret-123',
      },
    });
    const res = await GET(req);
    assert.equal(res.status, 401);
    const body = await res.json();
    assert.deepEqual(body, {
      error: 'Unauthorized: Invalid or missing CRON_SECRET token',
    });
  });

  it('rejects POST request with 401 when authorization is missing or invalid', async () => {
    const req = new Request('http://localhost/api/cron/fomo-reminder', {
      method: 'POST',
      headers: {
        authorization: 'Bearer invalid-token',
      },
    });
    const res = await POST(req);
    assert.equal(res.status, 401);
    const body = await res.json();
    assert.deepEqual(body, {
      error: 'Unauthorized: Invalid or missing CRON_SECRET token',
    });
  });

  it('asserts that authenticated requests query the 24-hour expiration window (gt: now, lte: in24Hours)', async () => {
    interface QueryCall {
      method: string;
      args: unknown[];
    }
    const calls: QueryCall[] = [];

    const mockSupabase = {
      from: (table: string) => {
        calls.push({ method: 'from', args: [table] });
        const chain: Record<string, unknown> = {
          select: (...args: unknown[]) => {
            calls.push({ method: 'select', args });
            return chain;
          },
          eq: (...args: unknown[]) => {
            calls.push({ method: 'eq', args });
            return chain;
          },
          gt: (...args: unknown[]) => {
            calls.push({ method: 'gt', args });
            return chain;
          },
          lte: (...args: unknown[]) => {
            calls.push({ method: 'lte', args });
            return Promise.resolve({ data: [], error: null });
          },
        };
        return chain;
      },
    };

    const before = Date.now();
    const req = new Request('http://localhost/api/cron/fomo-reminder', {
      method: 'GET',
      headers: {
        authorization: 'Bearer test-secret-123',
      },
    });

    const res = await GET(req, mockSupabase);
    const after = Date.now();

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.found, 0);

    const fromCall = calls.find((c) => c.method === 'from');
    assert.equal(fromCall?.args[0], 'business_demos');

    const eqCall = calls.find((c) => c.method === 'eq');
    assert.deepEqual(eqCall?.args, ['status', 'draft']);

    const gtCall = calls.find((c) => c.method === 'gt');
    assert.equal(gtCall?.args[0], 'fomo_expires_at');
    const gtTime = new Date(gtCall?.args[1] as string).getTime();
    assert.ok(gtTime >= before - 1000 && gtTime <= after + 1000, 'gt should be roughly current time');

    const lteCall = calls.find((c) => c.method === 'lte');
    assert.equal(lteCall?.args[0], 'fomo_expires_at');
    const lteTime = new Date(lteCall?.args[1] as string).getTime();
    const expectedLte = gtTime + 24 * 60 * 60 * 1000;
    assert.ok(Math.abs(lteTime - expectedLte) < 1000, 'lte should be in24Hours window');
  });
});
