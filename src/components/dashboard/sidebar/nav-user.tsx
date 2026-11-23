'use client'

import { ChevronsUpDown, LogOut } from 'lucide-react'
import * as React from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { authClient } from '@/lib/auth/client'

export interface SidebarUser {
  name?: string | null
  email?: string | null
  avatar?: string | null
  role?: string | null
  [key: string]: unknown
}

export interface NavUserProps {
  user: SidebarUser
}

export function NavUser({ user }: NavUserProps) {
  const { isMobile } = useSidebar()

  const displayName = user.name || 'Merchant'
  const displayEmail = user.email || ''
  const initials = user.name
    ? user.name
        .split(' ')
        .map(segment => segment[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : displayEmail
      ? displayEmail.charAt(0).toUpperCase()
      : 'M'

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                size="lg"
              />
            }
          >
            <div className="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-lg text-xs font-semibold uppercase">
              {initials}
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate font-semibold">{displayName}</span>
              <span className="text-muted-foreground truncate text-xs">{displayEmail}</span>
            </div>
            <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-(--anchor-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <div className="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-lg text-xs font-semibold uppercase">
                    {initials}
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{displayName}</span>
                    <span className="text-muted-foreground truncate text-xs">{displayEmail}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                await authClient.signOut()
                window.location.href = '/login'
              }}
            >
              <LogOut className="size-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
