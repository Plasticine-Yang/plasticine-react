import type { FunctionComponent, ReactElement } from '@plasticine-react/shared'

export function mountFunctionComponent(element: ReactElement): ReactElement {
  const { type, props } = element
  const functionComponent = type as FunctionComponent
  const renderedElement = functionComponent(props)

  return renderedElement
}
