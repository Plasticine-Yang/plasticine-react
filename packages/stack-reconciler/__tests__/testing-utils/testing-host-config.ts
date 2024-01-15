import type { HostConfig } from '@/types'

import { TestingHostNode } from './testing-host-node'

export const testingHostConfig: HostConfig<TestingHostNode> = {
  createHostNode(type) {
    return new TestingHostNode(type)
  },
  setHostNodeAttribute(hostNode, key, value) {
    hostNode.setHostNodeAttribute(key, value)
  },
  appendChild(hostNode, childNode) {
    hostNode.appendChild(childNode)
  },
}
