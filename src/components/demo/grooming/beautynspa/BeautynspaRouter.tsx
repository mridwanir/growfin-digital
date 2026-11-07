'use client'

import type { BusinessDemo } from '@/lib/types'

import { DayspaLayout } from './themes/dayspa/DayspaLayout'
import { DefaultLayout } from './themes/default/DefaultLayout'
import { LumiereLayout } from './themes/lumiere/LumiereLayout'
export function BeautynspaRouter({
  client,
  themeName,
}: {
  client: BusinessDemo
  themeName?: string
}) {
  return (
    <>
      {themeName === 'lumiere' ? (
        <LumiereLayout />
      ) : themeName === 'dayspa' ? (
        <DayspaLayout />
      ) : (
        <DefaultLayout />
      )}
    </>
  )
}
