import { describe, expect, it } from 'vitest'

import { Badge, badgeVariants } from './badge'
import { Button, buttonVariants } from './button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './dropdown-menu'
import { Input } from './input'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from './popover'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './select'
import { Separator } from './separator'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from './sidebar'
import { Skeleton } from './skeleton'
import { Switch } from './switch'
import { Tabs, TabsContent, TabsList, tabsListVariants, TabsTrigger } from './tabs'
import { Textarea } from './textarea'
import { Toggle, toggleVariants } from './toggle'
import { ToggleGroup, ToggleGroupItem } from './toggle-group'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

describe('shadcn primitives installation (ticket 02)', () => {
  describe('sidebar primitive', () => {
    it('exports all sidebar components and hooks', () => {
      expect(Sidebar).toBeDefined()
      expect(SidebarContent).toBeDefined()
      expect(SidebarFooter).toBeDefined()
      expect(SidebarGroup).toBeDefined()
      expect(SidebarGroupAction).toBeDefined()
      expect(SidebarGroupContent).toBeDefined()
      expect(SidebarGroupLabel).toBeDefined()
      expect(SidebarHeader).toBeDefined()
      expect(SidebarInput).toBeDefined()
      expect(SidebarInset).toBeDefined()
      expect(SidebarMenu).toBeDefined()
      expect(SidebarMenuAction).toBeDefined()
      expect(SidebarMenuBadge).toBeDefined()
      expect(SidebarMenuButton).toBeDefined()
      expect(SidebarMenuItem).toBeDefined()
      expect(SidebarMenuSkeleton).toBeDefined()
      expect(SidebarMenuSub).toBeDefined()
      expect(SidebarMenuSubButton).toBeDefined()
      expect(SidebarMenuSubItem).toBeDefined()
      expect(SidebarProvider).toBeDefined()
      expect(SidebarRail).toBeDefined()
      expect(SidebarSeparator).toBeDefined()
      expect(SidebarTrigger).toBeDefined()
      expect(useSidebar).toBeDefined()
    })
  })

  describe('tabs primitive', () => {
    it('exports tabs components and variants', () => {
      expect(Tabs).toBeDefined()
      expect(TabsList).toBeDefined()
      expect(TabsTrigger).toBeDefined()
      expect(TabsContent).toBeDefined()
      expect(tabsListVariants).toBeDefined()
    })
  })

  describe('sheet primitive', () => {
    it('exports sheet components', () => {
      expect(Sheet).toBeDefined()
      expect(SheetTrigger).toBeDefined()
      expect(SheetContent).toBeDefined()
      expect(SheetClose).toBeDefined()
      expect(SheetHeader).toBeDefined()
      expect(SheetFooter).toBeDefined()
      expect(SheetTitle).toBeDefined()
      expect(SheetDescription).toBeDefined()
    })
  })

  describe('popover primitive', () => {
    it('exports popover components', () => {
      expect(Popover).toBeDefined()
      expect(PopoverTrigger).toBeDefined()
      expect(PopoverContent).toBeDefined()
      expect(PopoverHeader).toBeDefined()
      expect(PopoverTitle).toBeDefined()
      expect(PopoverDescription).toBeDefined()
    })
  })

  describe('dropdown-menu primitive', () => {
    it('exports dropdown menu components', () => {
      expect(DropdownMenu).toBeDefined()
      expect(DropdownMenuTrigger).toBeDefined()
      expect(DropdownMenuContent).toBeDefined()
      expect(DropdownMenuItem).toBeDefined()
      expect(DropdownMenuGroup).toBeDefined()
      expect(DropdownMenuLabel).toBeDefined()
      expect(DropdownMenuCheckboxItem).toBeDefined()
      expect(DropdownMenuRadioGroup).toBeDefined()
      expect(DropdownMenuRadioItem).toBeDefined()
      expect(DropdownMenuSeparator).toBeDefined()
      expect(DropdownMenuShortcut).toBeDefined()
      expect(DropdownMenuSub).toBeDefined()
      expect(DropdownMenuSubTrigger).toBeDefined()
      expect(DropdownMenuSubContent).toBeDefined()
    })
  })

  describe('toggle and toggle-group primitives', () => {
    it('exports toggle and toggle-group components', () => {
      expect(Toggle).toBeDefined()
      expect(toggleVariants).toBeDefined()
      expect(ToggleGroup).toBeDefined()
      expect(ToggleGroupItem).toBeDefined()
    })
  })

  describe('switch primitive', () => {
    it('exports switch component', () => {
      expect(Switch).toBeDefined()
    })
  })

  describe('textarea primitive', () => {
    it('exports textarea component', () => {
      expect(Textarea).toBeDefined()
    })
  })

  describe('tooltip primitive', () => {
    it('exports tooltip components', () => {
      expect(Tooltip).toBeDefined()
      expect(TooltipTrigger).toBeDefined()
      expect(TooltipContent).toBeDefined()
      expect(TooltipProvider).toBeDefined()
    })
  })

  describe('select primitive', () => {
    it('exports select components', () => {
      expect(Select).toBeDefined()
      expect(SelectTrigger).toBeDefined()
      expect(SelectContent).toBeDefined()
      expect(SelectGroup).toBeDefined()
      expect(SelectItem).toBeDefined()
      expect(SelectLabel).toBeDefined()
      expect(SelectScrollDownButton).toBeDefined()
      expect(SelectScrollUpButton).toBeDefined()
      expect(SelectSeparator).toBeDefined()
      expect(SelectValue).toBeDefined()
    })
  })

  describe('badge primitive', () => {
    it('exports badge component and variants', () => {
      expect(Badge).toBeDefined()
      expect(badgeVariants).toBeDefined()
    })
  })

  describe('existing customized components preservation', () => {
    it('preserves customized button, input, separator, and skeleton', () => {
      expect(Button).toBeDefined()
      expect(buttonVariants).toBeDefined()
      expect(Input).toBeDefined()
      expect(Separator).toBeDefined()
      expect(Skeleton).toBeDefined()
    })
  })
})
