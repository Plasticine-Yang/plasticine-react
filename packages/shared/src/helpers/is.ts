import { classComponentSymbol } from '@/symbols'
import { BaseProps, ClassComponent, FunctionComponent, ReactElementType } from '@/types'

export function isHostComponent<Props extends BaseProps = BaseProps>(
  elementType: ReactElementType<Props>,
): elementType is string {
  return typeof elementType === 'string'
}

export function isFunctionComponent<Props extends BaseProps = BaseProps>(
  elementType: ReactElementType<Props>,
): elementType is FunctionComponent<Props> {
  return typeof elementType === 'function'
}

export function isClassComponent<Props extends BaseProps = BaseProps>(
  elementType: ReactElementType<Props>,
): elementType is ClassComponent<Props> {
  return typeof elementType === 'function' && (elementType as unknown as typeof ClassComponent)[classComponentSymbol]
}
