import type { ReactNode } from 'react'

/**
 * WeakMap cache mapping component props to their rendered ReactElement tree. Allows shallow element
 * traversal utilities like findElementBySlot to inspect rendered output during unit tests without
 * requiring synthetic DOM mounting.
 */
export const componentRenderCache = new WeakMap<object, ReactNode>()
