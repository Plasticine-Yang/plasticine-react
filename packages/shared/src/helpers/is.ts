import type { ClassComponent } from '@/class-component'
import { classComponentSymbol } from '@/symbols'
import type { FunctionComponent, ReactElementType } from '@/types'

export function isHostComponent(elementType: ReactElementType): elementType is string {
  return typeof elementType === 'string'
}

export function isFunctionComponent(elementType: ReactElementType): elementType is FunctionComponent {
  return typeof elementType === 'function'
}

export function isClassComponent(elementType: ReactElementType): elementType is typeof ClassComponent {
  return typeof elementType === 'function' && (elementType as typeof ClassComponent)[classComponentSymbol]
}
