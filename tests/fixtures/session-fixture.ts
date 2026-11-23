export interface MockSessionOptions {
  name?: string
  email?: string
  emailVerified?: boolean
  expiresAt?: Date
  role?: string
  user?: null
  userId?: string
  activeOrganizationId?: string | null
}

interface SessionData {
  session: {
    id: string
    activeOrganizationId?: string | null
    createdAt: Date
    expiresAt: Date
    ipAddress: string | null
    token: string
    updatedAt: Date
    userAgent: string | null
    userId: string
  }
  user: {
    id: string
    name: string
    createdAt: Date
    email: string
    emailVerified: boolean
    image: string | null
    role: string
    updatedAt: Date
  }
}

export interface MockSessionResult {
  data: SessionData | null
  error: null
}

interface DefaultSessionParams {
  getDefaultEmail: (userId: string) => string
  name: string
  role: string
}

function createSessionPayload(
  options: MockSessionOptions,
  defaults: DefaultSessionParams,
): MockSessionResult {
  const userId = options.userId !== undefined ? options.userId : crypto.randomUUID()
  return {
    error: null,
    data: {
      session: {
        id: `sess-${crypto.randomUUID()}`,
        activeOrganizationId: options.activeOrganizationId ?? null,
        createdAt: new Date(),
        expiresAt: options.expiresAt ?? new Date(Date.now() + 86400000),
        ipAddress: null,
        token: `tok-${crypto.randomUUID()}`,
        updatedAt: new Date(),
        userAgent: null,
        userId,
      },
      user:
        options.user === null
          ? (null as unknown as SessionData['user'])
          : {
              id: userId,
              name: options.name ?? defaults.name,
              createdAt: new Date(),
              email: options.email ?? defaults.getDefaultEmail(userId),
              emailVerified: options.emailVerified ?? true,
              image: null,
              role: options.role ?? defaults.role,
              updatedAt: new Date(),
            },
    },
  }
}

export function createMerchantSession(options: MockSessionOptions = {}): MockSessionResult {
  return createSessionPayload(options, {
    name: 'Test Merchant',
    role: 'merchant',
    getDefaultEmail: userId => `merchant-${userId.slice(0, 6)}@growfin.test`,
  })
}

export function createCustomerSession(options: MockSessionOptions = {}): MockSessionResult {
  return createSessionPayload(options, {
    name: 'Test Customer',
    role: 'customer',
    getDefaultEmail: userId => `customer-${userId.slice(0, 6)}@example.com`,
  })
}

export function createUnauthenticatedSession(): MockSessionResult {
  return {
    data: null,
    error: null,
  }
}
