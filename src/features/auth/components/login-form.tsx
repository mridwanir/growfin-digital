'use client'

import { ArrowLeft, CheckCircle2, Mail } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { GoogleIcon } from '@/components/brand'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { authClient } from '@/lib/auth/client'

type LoginStep = 'credentials' | 'reset_password_sent' | 'reset_password'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [step, setStep] = useState<LoginStep>('credentials')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const validateEmail = (): boolean => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.')
      return false
    }
    return true
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateEmail()) return
    if (!password) {
      setError('Please enter your password.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { error: authError } = await authClient.signIn.email({
        callbackURL: '/dashboard',
        email,
        password,
      })

      if (authError) {
        setError(authError.message || 'Invalid email or password.')
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    setError(null)
    try {
      await authClient.signIn.social({
        callbackURL: '/dashboard',
        provider: 'google',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal masuk dengan Google.')
      setGoogleLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateEmail()) return

    setLoading(true)
    setError(null)

    try {
      const { error: authError } = await authClient.requestPasswordReset({
        email,
      })

      if (authError) {
        setError(authError.message || 'Failed to send password reset instructions.')
      } else {
        setStep('reset_password_sent')
        setMessage(`Password reset instructions were sent to ${email}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setStep('credentials')
    setError(null)
    setMessage(null)
    setPassword('')
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="bg-primary text-primary-foreground mx-auto flex size-12 items-center justify-center rounded-xl">
            <Mail className="size-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            {step === 'credentials' && 'Sign in to Growfin Digital'}
            {step === 'reset_password' && 'Reset your password'}
            {step === 'reset_password_sent' && 'Check your inbox'}
          </CardTitle>
          <CardDescription>
            {step === 'credentials' && 'Sign in with your email and password'}
            {step === 'reset_password' && 'Enter your email to receive password reset instructions'}
            {step === 'reset_password_sent' && message}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === 'credentials' && (
            <form className="flex flex-col gap-6" onSubmit={handleSignIn}>
              <FieldGroup>
                <Field data-invalid={error ? true : undefined}>
                  <FieldLabel htmlFor="email">Email address</FieldLabel>
                  <Input
                    required
                    aria-invalid={error ? true : undefined}
                    autoComplete="email"
                    disabled={loading}
                    id="email"
                    name="email"
                    placeholder="merchant@example.com"
                    type="email"
                    value={email}
                    onChange={e => {
                      setEmail(e.target.value)
                      if (error) setError(null)
                    }}
                  />
                </Field>
                <Field data-invalid={error ? true : undefined}>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Button
                      className="text-xs"
                      disabled={loading}
                      type="button"
                      variant="link"
                      onClick={() => {
                        setError(null)
                        setStep('reset_password')
                      }}
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <Input
                    required
                    aria-invalid={error ? true : undefined}
                    autoComplete="current-password"
                    disabled={loading}
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={e => {
                      setPassword(e.target.value)
                      if (error) setError(null)
                    }}
                  />
                  {error && <FieldDescription>{error}</FieldDescription>}
                </Field>
              </FieldGroup>

              <div className="flex flex-col gap-3">
                <Button
                  className="w-full"
                  disabled={loading || googleLoading}
                  size="lg"
                  type="submit"
                >
                  {loading && <Spinner data-icon="inline-start" />}
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>

                <div className="relative my-1">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card text-muted-foreground px-2">Atau</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  disabled={loading || googleLoading}
                  size="lg"
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignIn}
                >
                  {googleLoading ? (
                    <Spinner data-icon="inline-start" />
                  ) : (
                    <GoogleIcon className="mr-2 size-4" />
                  )}
                  <span>Masuk dengan Google</span>
                </Button>

                <div className="text-muted-foreground text-center text-xs">
                  Belum memiliki akun?{' '}
                  <Link className="text-primary font-medium hover:underline" href="/onboarding">
                    Daftar di sini
                  </Link>
                </div>
              </div>
            </form>
          )}

          {step === 'reset_password_sent' && (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <CheckCircle2 className="text-primary" />
                </EmptyMedia>
                <EmptyTitle>Reset link dispatched</EmptyTitle>
                <EmptyDescription>
                  We sent password reset instructions to{' '}
                  <strong className="text-foreground font-semibold">{email}</strong>. Check your
                  inbox to continue.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent className="flex flex-col gap-3">
                <Button className="w-full" variant="ghost" onClick={resetForm}>
                  <ArrowLeft data-icon="inline-start" />
                  Back to sign in
                </Button>
              </EmptyContent>
            </Empty>
          )}

          {step === 'reset_password' && (
            <form className="flex flex-col gap-6" onSubmit={handleResetPassword}>
              <FieldGroup>
                <Field data-invalid={error ? true : undefined}>
                  <FieldLabel htmlFor="reset-email">Email address</FieldLabel>
                  <Input
                    required
                    aria-invalid={error ? true : undefined}
                    autoComplete="email"
                    disabled={loading}
                    id="reset-email"
                    name="email"
                    placeholder="merchant@example.com"
                    type="email"
                    value={email}
                    onChange={e => {
                      setEmail(e.target.value)
                      if (error) setError(null)
                    }}
                  />
                  {error && <FieldDescription>{error}</FieldDescription>}
                </Field>
              </FieldGroup>

              <div className="flex flex-col gap-3">
                <Button className="w-full" disabled={loading} size="lg" type="submit">
                  {loading && <Spinner data-icon="inline-start" />}
                  {loading ? 'Sending link...' : 'Send reset instructions'}
                </Button>
                <Button className="w-full" variant="ghost" onClick={resetForm}>
                  <ArrowLeft data-icon="inline-start" />
                  Back to sign in
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
