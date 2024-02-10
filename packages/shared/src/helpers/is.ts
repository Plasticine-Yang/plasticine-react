import type { ClassComponent } from '@/class-component'
import { classComponentSymbol } from '@/symbols'
import type { FunctionComponent, ReactElement, ReactElementType, ReactNode, ReactTextNode } from '@/types'

export function isHostComponent(elementType: ReactElementType): elementType is string {
  return typeof elementType === 'string'
}

export function isFunctionComponent(elementType: ReactElementType): elementType is FunctionComponent {
  return typeof elementType === 'function'
}

export function isClassComponent(elementType: ReactElementType): elementType is typeof ClassComponent {
  return typeof elementType === 'function' && (elementType as typeof ClassComponent)[classComponentSymbol]
}

export function isValidReactElement(reactNode: ReactNode): reactNode is ReactElement {
  return (
    // ReactElement should be an object
    typeof reactNode === 'object' &&
    // ReactElement type is defined and should be one of HostComponent, FunctionComponent and ClassComponent
    reactNode?.type !== undefined &&
    Boolean(
      isHostComponent(reactNode.type) || isFunctionComponent(reactNode.type) || isClassComponent(reactNode.type),
    ) &&
    // ReactElement props should be an object
    typeof reactNode.props === 'object'
  )
}

export function isReactTextNode(reactNode: ReactNode): reactNode is ReactTextNode {
  return ['string', 'number', 'boolean'].includes(typeof reactNode)
}
