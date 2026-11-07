import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  emptyStringAsUndefined: true,
  client: {
    NEXT_PUBLIC_BASE_DOMAIN: z.string().min(1),
    NEXT_PUBLIC_MIDTRANS_CLIENT_KEY: z.string().min(1),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_BASE_DOMAIN: process.env.NEXT_PUBLIC_BASE_DOMAIN,
    NEXT_PUBLIC_MIDTRANS_CLIENT_KEY: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
    NODE_ENV: process.env.NODE_ENV,
  },
  server: {
    ADMIN_EMAILS: z.string().min(1),
    CRON_SECRET: z.string().min(32, { message: 'CRON_SECRET must be at least 32 characters long' }),
    EMAIL_FROM: z.string().default('Growfin Digital <auth@growfin.my.id>'),

    GEMINI_API_KEY: z.string().min(1),
    GOOGLE_MAPS_API_KEY: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),

    AWS_ACCESS_KEY_ID: z.string().min(1),
    AWS_ENDPOINT_URL_S3: z.url(),
    AWS_REGION: z.string().min(1),
    AWS_SECRET_ACCESS_KEY: z.string().min(1),

    DATABASE_URL: z.string().min(1),
    DATABASE_URL_UNPOOLED: z.string().min(1).optional(),
    NEON_AUTH_BASE_URL: z.url(),
    NEON_AUTH_COOKIE_SECRET: z
      .string()
      .min(32, { message: 'NEON_AUTH_COOKIE_SECRET must be at least 32 characters long' }),

    MIDTRANS_CLIENT_KEY: z.string().min(1),
    MIDTRANS_IS_PRODUCTION: z.stringbool().default(false),
    MIDTRANS_SERVER_KEY: z.string().min(1),
  },
  shared: {
    NODE_ENV: z.enum(['test', 'development', 'production']).optional(),
  },
  skipValidation:
    Boolean(process.env.SKIP_ENV_VALIDATION) || process.env.npm_lifecycle_event === 'lint',
})
