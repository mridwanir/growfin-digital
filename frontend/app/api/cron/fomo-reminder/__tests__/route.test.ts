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
});
