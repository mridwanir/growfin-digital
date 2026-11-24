'use client'

import { CheckCircle2, ChevronRight, Store, UserCheck } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { GoogleIcon } from '@/components/brand'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { authClient } from '@/lib/auth/client'
import { createStoreOnboardingAction } from '@/lib/onboarding/actions'
import { STORE_CATEGORIES } from '@/lib/onboarding/constants'
import { generateSlug } from '@/lib/onboarding/utils'

interface OnboardingWizardProps {
  initialStep?: 1 | 2
  userEmail?: string | null
  userName?: string | null
}

function validateStep1Credentials(name: string, email: string, password: string): string | null {
  if (!name.trim()) {
    return 'Nama lengkap wajib diisi'
  }
  if (!email.trim() || !email.includes('@')) {
    return 'Format email tidak valid'
  }
  if (!password || password.length < 8) {
    return 'Kata sandi minimal 8 karakter'
  }
  return null
}

function WizardHeader({ step }: { step: 1 | 2 }) {
  const isStep1 = step === 1
  return (
    <CardHeader className="text-center">
      <div className="bg-primary/10 text-primary mx-auto flex size-12 items-center justify-center rounded-xl">
        {isStep1 ? <UserCheck className="size-6" /> : <Store className="size-6" />}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        <span
          className={`flex size-6 items-center justify-center rounded-full text-xs font-semibold ${
            isStep1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          }`}
        >
          1
        </span>
        <span className="text-muted-foreground text-xs font-medium">Buat Akun</span>
        <ChevronRight className="text-muted-foreground size-3.5" />
        <span
          className={`flex size-6 items-center justify-center rounded-full text-xs font-semibold ${
            !isStep1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          }`}
        >
          2
        </span>
        <span className="text-muted-foreground text-xs font-medium">Informasi Toko</span>
      </div>

      <CardTitle aria-level={1} className="mt-4 text-2xl font-bold tracking-tight" role="heading">
        {isStep1 ? 'Mulai Bersama MeracikWeb' : 'Atur Toko Online Anda'}
      </CardTitle>
      <CardDescription>
        {isStep1
          ? 'Langkah 1 dari 2: Daftarkan akun pemilik toko Anda'
          : 'Langkah 2 dari 2: Masukkan informasi toko untuk menyiapkan website Anda'}
      </CardDescription>
    </CardHeader>
  )
}
export function OnboardingWizard({
  initialStep = 1,
  userEmail = null,
  userName = null,
}: OnboardingWizardProps) {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(initialStep)

  // Step 1 State: User Credentials
  const [name, setName] = useState(userName || '')
  const [email, setEmail] = useState(userEmail || '')
  const [password, setPassword] = useState('')

  // Step 2 State: Store Information
  const [storeName, setStoreName] = useState('')
  const [slug, setSlug] = useState('')
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false)
  const [category, setCategory] = useState<string>(STORE_CATEGORIES[0])
  const [phone, setPhone] = useState('')

  // UI State
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  // Handle store name change with auto-slug generation
  const handleStoreNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextName = e.target.value
    setStoreName(nextName)
    if (!isSlugManuallyEdited) {
      setSlug(generateSlug(nextName))
    }
  }

  // Handle manual slug change
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSlugManuallyEdited(true)
    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
  }

  // Handle Step 1 submit: Create account via Better Auth
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})
    const validationError = validateStep1Credentials(name, email, password)
    if (validationError) {
      setError(validationError)
      return
    }
    setLoading(true)
    try {
      const result = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      })

      if (result.error) {
        setError(result.error.message || 'Gagal mendaftarkan akun. Silakan coba lagi.')
        return
      }

      // Proceed to Step 2
      setStep(2)
    } catch {
      setError('Terjadi kendala saat mendaftarkan akun. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  // Handle Google OAuth sign up: initiate Better Auth Google social sign-in
  const handleGoogleSignUp = async () => {
    setGoogleLoading(true)
    setError(null)
    try {
      await authClient.signIn.social({
        callbackURL: '/dashboard',
        provider: 'google',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mendaftar dengan Google.')
      setGoogleLoading(false)
    }
  }

  // Handle Step 2 submit: Create organization & provision storefront via Server Action
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})

    setLoading(true)
    try {
      const result = await createStoreOnboardingAction({
        name: storeName.trim(),
        category: category.trim(),
        phone: phone.trim(),
        slug: slug.trim(),
      })

      if (!result.success) {
        setError(result.error)
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors)
        }
        return
      }

      // Success: redirect to dashboard
      const targetUrl = result.data?.redirectUrl || '/dashboard'
      router.push(targetUrl)
    } catch {
      setError('Terjadi kendala saat menyimpan informasi toko. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg shadow-md">
        <WizardHeader step={step} />

        <CardContent className="flex flex-col gap-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === 1 && (
            <form className="flex flex-col gap-5" onSubmit={handleStep1Submit}>
              <FieldGroup>
                <Field data-invalid={fieldErrors.name ? true : undefined}>
                  <FieldLabel htmlFor="name">Nama Lengkap</FieldLabel>
                  <Input
                    required
                    autoComplete="name"
                    disabled={loading}
                    id="name"
                    name="name"
                    placeholder="Contoh: Budi Santoso"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                  {fieldErrors.name && (
                    <p className="text-destructive text-xs">{fieldErrors.name.join(', ')}</p>
                  )}
                </Field>

                <Field data-invalid={fieldErrors.email ? true : undefined}>
                  <FieldLabel htmlFor="email">Alamat Email</FieldLabel>
                  <Input
                    required
                    autoComplete="email"
                    disabled={loading}
                    id="email"
                    name="email"
                    placeholder="nama@tokoanda.com"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  {fieldErrors.email && (
                    <p className="text-destructive text-xs">{fieldErrors.email.join(', ')}</p>
                  )}
                </Field>

                <Field data-invalid={fieldErrors.password ? true : undefined}>
                  <FieldLabel htmlFor="password">Kata Sandi</FieldLabel>
                  <Input
                    required
                    autoComplete="new-password"
                    disabled={loading}
                    id="password"
                    name="password"
                    placeholder="Minimal 8 karakter"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <FieldDescription>Gunakan kombinasi huruf, angka, dan simbol.</FieldDescription>
                  {fieldErrors.password && (
                    <p className="text-destructive text-xs">{fieldErrors.password.join(', ')}</p>
                  )}
                </Field>
              </FieldGroup>

              <Button className="w-full" disabled={loading || googleLoading} type="submit">
                {loading ? (
                  <>
                    <Spinner className="mr-2" />
                    Mendaftarkan...
                  </>
                ) : (
                  'Lanjut ke Detail Toko'
                )}
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
                type="button"
                variant="outline"
                onClick={handleGoogleSignUp}
              >
                {googleLoading ? (
                  <Spinner className="mr-2" />
                ) : (
                  <GoogleIcon className="mr-2 size-4" />
                )}
                <span>Daftar dengan Google</span>
              </Button>

              <div className="text-muted-foreground text-center text-xs">
                Sudah memiliki akun?{' '}
                <Link className="text-primary font-medium hover:underline" href="/login">
                  Masuk di sini
                </Link>
              </div>
            </form>
          )}

          {step === 2 && (
            <form className="flex flex-col gap-5" onSubmit={handleStep2Submit}>
              <FieldGroup>
                <Field data-invalid={fieldErrors.name ? true : undefined}>
                  <FieldLabel htmlFor="store-name">Nama Toko / Usaha</FieldLabel>
                  <Input
                    required
                    autoComplete="off"
                    disabled={loading}
                    id="store-name"
                    name="name"
                    placeholder="Contoh: Kopi Kenangan Mantap"
                    value={storeName}
                    onChange={handleStoreNameChange}
                  />
                  {fieldErrors.name && (
                    <p className="text-destructive text-xs">{fieldErrors.name.join(', ')}</p>
                  )}
                </Field>

                <Field data-invalid={fieldErrors.slug ? true : undefined}>
                  <FieldLabel htmlFor="store-slug">Alamat Link Toko</FieldLabel>
                  <div className="flex items-center gap-1.5">
                    <Input
                      required
                      autoComplete="off"
                      className="font-mono text-sm"
                      disabled={loading}
                      id="store-slug"
                      name="slug"
                      placeholder="kopi-kenangan-mantap"
                      value={slug}
                      onChange={handleSlugChange}
                    />
                  </div>
                  <FieldDescription>
                    Alamat toko online Anda:{' '}
                    <span className="text-foreground font-mono font-medium">
                      {slug ? `${slug}.growfin.my.id` : 'namatoko.growfin.my.id'}
                    </span>
                  </FieldDescription>
                  {fieldErrors.slug && (
                    <p className="text-destructive text-xs">{fieldErrors.slug.join(', ')}</p>
                  )}
                </Field>

                <Field data-invalid={fieldErrors.category ? true : undefined}>
                  <FieldLabel htmlFor="store-category">Kategori Usaha</FieldLabel>
                  <select
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={loading}
                    id="store-category"
                    name="category"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                  >
                    {STORE_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <FieldDescription>
                    Pilih kategori yang paling sesuai untuk menyesuaikan tampilan katalog dan order.
                  </FieldDescription>
                  {fieldErrors.category && (
                    <p className="text-destructive text-xs">{fieldErrors.category.join(', ')}</p>
                  )}
                </Field>

                <Field data-invalid={fieldErrors.phone ? true : undefined}>
                  <FieldLabel htmlFor="store-phone">Nomor WhatsApp</FieldLabel>
                  <Input
                    required
                    autoComplete="tel"
                    disabled={loading}
                    id="store-phone"
                    name="phone"
                    placeholder="Contoh: 081234567890"
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                  <FieldDescription>
                    Nomor WhatsApp aktif untuk menerima notifikasi dan pesanan langsung dari
                    pelanggan.
                  </FieldDescription>
                  {fieldErrors.phone && (
                    <p className="text-destructive text-xs">{fieldErrors.phone.join(', ')}</p>
                  )}
                </Field>
              </FieldGroup>

              <Button className="w-full" disabled={loading} type="submit">
                {loading ? (
                  <>
                    <Spinner className="mr-2" />
                    Menyiapkan Toko...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 size-4" />
                    Buat Toko & Buka Dashboard
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
