import { REACT_ELEMENT_TYPE } from '@plasticine-react/shared'
import type {
  ElementType,
  Key,
  Ref,
  Props,
  ReactElement,
} from '@plasticine-react/shared'

const ReactElement = function (
  type: ElementType,
  key: Key,
  ref: Ref,
  props: Props,
) {
  const element: ReactElement = {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    key,
    ref,
    props,
    __mark: 'Plasticine-Yang',
  }

  return element
}

const hasValidKey = (config: any) => config.key !== undefined
const hasValidRef = (config: any) => config.ref !== undefined

/** @description 特殊属性不会作为 props 被赋值 */
const RESERVED_PROPS = {
  key: true,
  ref: true,
}

function jsx(type: ElementType, config: any) {
  let propName: string

  const props: Props = {}

  let key: Key = null
  let ref: Ref = null

  // 赋值 key
  if (hasValidKey(config)) {
    key = '' + config.key
  }

  // 赋值 ref
  if (hasValidRef(config)) {
    ref = config.ref
  }

  // 赋值 props
  for (propName in config) {
    if (
      Object.prototype.hasOwnProperty.call(config, propName) &&
      !RESERVED_PROPS.hasOwnProperty(propName)
    ) {
      props[propName] = config[propName]
    }
  }

  // 赋值 defaultProps
  if (type?.defaultProps) {
    const defaultProps = type.defaultProps
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName]
      }
    }
  }

  return ReactElement(type, key, ref, props)
}

const jsxDEV = jsx

export { jsx, jsxDEV }
