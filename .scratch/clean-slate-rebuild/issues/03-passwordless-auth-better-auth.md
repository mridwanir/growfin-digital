# 03: Passwordless Authentication Flow with Better Auth

**What to build:** End-to-end passwordless email authentication (magic link and OTP via Resend) powered by Neon Managed Better Auth, with cross-subdomain session persistence and super admin authorization gating.

**Blocked by:** 02: Hybrid Database Schema and Neon Connection Setup

**Status:** resolved

- [x] Configure Neon Managed Better Auth server and client handlers using the Email Magic Link and OTP plugin with Resend
- [x] Build login page at `/login` allowing merchants to enter their email address and request a magic link or one-time passcode
- [x] Configure cross-subdomain session cookies (`.growfin.my.id` in production, localhost in development)
- [x] Protect `/dashboard` routes so unauthenticated requests redirect to `/login`
- [x] Implement administrator authorization guard checking user emails against the `ADMIN_EMAILS` environment variable before granting access to `/admin`
- [x] Automated integration test: request an OTP/magic link, verify credentials, receive session cookies, and access protected route handlers
