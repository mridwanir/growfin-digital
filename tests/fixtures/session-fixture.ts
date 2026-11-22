export interface MockSessionOptions {
  name?: string
  email?: string
  emailVerified?: boolean
  expiresAt?: Date
  role?: string
  user?: null
  userId?: string
}

export interface SessionData {
  session: {
    id: string
    createdAt: Date
    expiresAt: Date
    token: string
    updatedAt: Date
    userId: string
  }
  user: {
    id: string
    name: string
    createdAt: Date
    email: string
    emailVerified: boolean
    role: string
    updatedAt: Date
  }
}

export interface MockSessionResult {
  data: SessionData | null
  error: null
}

export function createMerchantSession(options: MockSessionOptions = {}): MockSessionResult {
  const userId = options.userId !== undefined ? options.userId : crypto.randomUUID()
  return {
    error: null,
    data: {
      session: {
        id: `sess-${crypto.randomUUID()}`,
        createdAt: new Date(),
        expiresAt: options.expiresAt ?? new Date(Date.now() + 86400000),
        token: `tok-${crypto.randomUUID()}`,
        updatedAt: new Date(),
        userId,
      },
      user:
        options.user === null
          ? (null as unknown as SessionData['user'])
          : {
              id: userId,
              name: options.name ?? 'Test Merchant',
              createdAt: new Date(),
              email: options.email ?? `merchant-${userId.slice(0, 6)}@growfin.test`,
              emailVerified: options.emailVerified ?? true,
              role: options.role ?? 'merchant',
              updatedAt: new Date(),
            },
    },
  }
}

export function createCustomerSession(options: MockSessionOptions = {}): MockSessionResult {
  const userId = options.userId !== undefined ? options.userId : crypto.randomUUID()
  return {
    error: null,
    data: {
      session: {
        id: `sess-${crypto.randomUUID()}`,
        createdAt: new Date(),
        expiresAt: options.expiresAt ?? new Date(Date.now() + 86400000),
        token: `tok-${crypto.randomUUID()}`,
        updatedAt: new Date(),
        userId,
      },
      user: {
        id: userId,
        name: options.name ?? 'Test Customer',
        createdAt: new Date(),
        email: options.email ?? `customer-${userId.slice(0, 6)}@example.com`,
        emailVerified: options.emailVerified ?? true,
        role: options.role ?? 'customer',
        updatedAt: new Date(),
      },
    },
  }
}

export function createUnauthenticatedSession(): MockSessionResult {
  return {
    data: null,
    error: null,
  }
}
