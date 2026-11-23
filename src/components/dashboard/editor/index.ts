import { StorefrontEditorCanvas } from './canvas'
import { StorefrontEditorInspector } from './inspector'
import { StorefrontEditorRoot } from './root'
import { StorefrontEditorSidebar } from './sidebar'
import { StorefrontEditorToolbar } from './toolbar'

export const StorefrontEditor = {
  Canvas: StorefrontEditorCanvas,
  Inspector: StorefrontEditorInspector,
  Root: StorefrontEditorRoot,
  Sidebar: StorefrontEditorSidebar,
  Toolbar: StorefrontEditorToolbar,
}

export * from './canvas'
export * from './context'
export * from './inspector'
export * from './root'
export * from './sidebar'
export * from './toolbar'
