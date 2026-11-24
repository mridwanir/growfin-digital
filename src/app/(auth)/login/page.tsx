import type { Metadata } from 'next'

import { LoginForm } from '@/features/auth'

export const metadata: Metadata = {
  description: 'Masuk ke akun merchant MeracikWeb untuk mengelola toko online Anda.',
  title: 'Masuk - MeracikWeb',
}

export default function LoginPage() {
  return <LoginForm />
}
