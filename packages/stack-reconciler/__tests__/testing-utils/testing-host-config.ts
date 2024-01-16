import { JSDOM } from 'jsdom'

import type { HostConfig } from '@/types'

export const testingHostConfig: HostConfig<HTMLElement> = {
  createHostNode(type) {
    const document = new JSDOM().window.document

    const hostNode = document.createElement(type)

    return hostNode
  },
  setHostNodeAttribute(hostNode, key, value) {
    if (typeof key === 'string') {
      hostNode.setAttribute(key, value as string)
    } else {
      throw new TypeError(`setHostNodeAttribute failed, typeof key is ${typeof key}, not string`)
    }
  },
  appendChild(hostNode, childNode) {
    hostNode.appendChild(childNode)
  },
}
