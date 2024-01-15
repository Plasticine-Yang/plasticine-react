export class TestingHostNode {
  public type: string
  public attributes: Record<PropertyKey, unknown>
  public children: TestingHostNode[]

  constructor(type: string) {
    this.type = type
    this.attributes = {}
    this.children = []
  }

  public setHostNodeAttribute(key: PropertyKey, value: unknown) {
    this.attributes[key] = value
  }

  public appendChild(childNode: TestingHostNode) {
    this.children.push(childNode)
  }
}
