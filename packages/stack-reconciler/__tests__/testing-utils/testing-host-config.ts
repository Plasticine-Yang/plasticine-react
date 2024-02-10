import { JSDOM } from 'jsdom'

import type { HostConfig } from '@/types'

export const testingHostConfig: HostConfig<HTMLElement, Text> = {
  create(type) {
    const document = new JSDOM().window.document

    const hostNode = document.createElement(type)

    return hostNode
  },

  createTextNode(textContent) {
    const document = new JSDOM().window.document

    const hostTextNode = document.createTextNode(textContent)

    return hostTextNode
  },

  setAttribute(hostNode, key, value) {
    if (typeof key === 'string') {
      hostNode.setAttribute(key, value as string)
    } else {
      throw new TypeError(`setHostNodeAttribute failed, typeof key is ${typeof key}, not string`)
    }
  },

  appendChild(hostNode, childNode) {
    hostNode.appendChild(childNode)
  },

  getFirstChild(hostNode) {
    return hostNode.firstChild as HTMLElement
  },

  unmount(hostNode) {
    hostNode.innerHTML = ''
  },

  unmountTextNode(hostTextNode) {
    hostTextNode.textContent = ''
  },
}
