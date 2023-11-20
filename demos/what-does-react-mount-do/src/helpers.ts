import { ClassComponent } from './class-component'

export function isClassComponent(type: any): type is ClassComponent {
  return type instanceof ClassComponent
}
