'use client'

import { ArrowLeft, CheckCircle2, KeyRound, Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

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
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { authClient } from '@/lib/auth/client'

type LoginStep = 'email' | 'magic_link_sent' | 'otp_entry'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<LoginStep>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const validateEmail = (): boolean => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.')
      return false
    }
    return true
  }

  const handleSendMagicLink = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!validateEmail()) return

    setLoading(true)
    setError(null)

    try {
      const { error: authError } = await authClient.signIn.magicLink({
        callbackURL: '/dashboard',
        email,
      })

      if (authError) {
        setError(authError.message || 'Failed to send magic link. Please try again.')
      } else {
        setStep('magic_link_sent')
        setMessage(`We sent a sign-in link to ${email}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!validateEmail()) return

    setLoading(true)
    setError(null)

    try {
      const { error: authError } = await authClient.emailOtp.sendVerificationOtp({
        type: 'sign-in',
        email,
      })

      if (authError) {
        setError(authError.message || 'Failed to send verification code. Please try again.')
      } else {
        setStep('otp_entry')
        setMessage(`A 6-digit verification code was sent to ${email}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp || otp.trim().length < 6) {
      setError('Please enter the full 6-digit verification code.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { error: authError } = await authClient.signIn.emailOtp({
        email,
        otp: otp.trim(),
      })

      if (authError) {
        setError(authError.message || 'Invalid or expired verification code.')
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setStep('email')
    setError(null)
    setMessage(null)
    setOtp('')
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="bg-primary text-primary-foreground mx-auto flex size-12 items-center justify-center rounded-xl">
            <Mail className="size-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            {step === 'email' && 'Sign in to Growfin Digital'}
            {step === 'magic_link_sent' && 'Check your inbox'}
            {step === 'otp_entry' && 'Enter verification code'}
          </CardTitle>
          <CardDescription>
            {step === 'email' && 'Passwordless merchant access via magic link or one-time code'}
            {step === 'magic_link_sent' && message}
            {step === 'otp_entry' && message}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === 'email' && (
            <form className="flex flex-col gap-6" onSubmit={handleSendMagicLink}>
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
                  {error && <FieldDescription>{error}</FieldDescription>}
                </Field>
              </FieldGroup>

              <div className="flex flex-col gap-3">
                <Button className="w-full" disabled={loading} size="lg" type="submit">
                  {loading ? (
                    <Spinner data-icon="inline-start" />
                  ) : (
                    <Mail data-icon="inline-start" />
                  )}
                  {loading ? 'Sending link...' : 'Send Magic Link'}
                </Button>

                <div className="relative my-2 flex items-center justify-center">
                  <Separator />
                  <span className="bg-card text-muted-foreground absolute px-2 text-xs uppercase">
                    Or
                  </span>
                </div>

                <Button
                  className="w-full"
                  disabled={loading}
                  size="lg"
                  type="button"
                  variant="outline"
                  onClick={handleSendOtp}
                >
                  {loading ? (
                    <Spinner data-icon="inline-start" />
                  ) : (
                    <KeyRound data-icon="inline-start" />
                  )}
                  {loading ? 'Sending code...' : 'Sign In with One-Time Code (OTP)'}
                </Button>
              </div>
            </form>
          )}

          {step === 'magic_link_sent' && (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <CheckCircle2 className="text-primary" />
                </EmptyMedia>
                <EmptyTitle>Authentication link dispatched</EmptyTitle>
                <EmptyDescription>
                  We have sent an authentication link to{' '}
                  <strong className="text-foreground font-semibold">{email}</strong>. Click the link
                  to sign in immediately.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent className="flex flex-col gap-3">
                <Button
                  className="w-full"
                  disabled={loading}
                  variant="outline"
                  onClick={handleSendMagicLink}
                >
                  {loading && <Spinner data-icon="inline-start" />}
                  Resend Magic Link
                </Button>
                <Button className="w-full" variant="ghost" onClick={resetForm}>
                  <ArrowLeft data-icon="inline-start" />
                  Use a different email
                </Button>
              </EmptyContent>
            </Empty>
          )}

          {step === 'otp_entry' && (
            <form className="flex flex-col gap-6" onSubmit={handleVerifyOtp}>
              <FieldGroup>
                <Field className="items-center" data-invalid={error ? true : undefined}>
                  <FieldLabel htmlFor="otp">6-digit Passcode</FieldLabel>
                  <InputOTP
                    autoFocus
                    aria-invalid={error ? true : undefined}
                    disabled={loading}
                    id="otp"
                    maxLength={6}
                    value={otp}
                    onChange={val => {
                      setOtp(val)
                      if (error) setError(null)
                    }}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </Field>
              </FieldGroup>

              <div className="flex flex-col gap-3">
                <Button
                  className="w-full"
                  disabled={loading || otp.length < 6}
                  size="lg"
                  type="submit"
                >
                  {loading && <Spinner data-icon="inline-start" />}
                  {loading ? 'Verifying...' : 'Verify & Sign In'}
                </Button>

                <div className="flex items-center justify-between pt-2">
                  <Button
                    disabled={loading}
                    size="xs"
                    type="button"
                    variant="link"
                    onClick={handleSendOtp}
                  >
                    Resend code
                  </Button>
                  <Button size="xs" type="button" variant="link" onClick={resetForm}>
                    Change email
                  </Button>
                </div>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
