# @plasticine-react/react-reconciler

## 0.0.3

### Patch Changes

- feat(react-reconciler): extract platform-related functions -- createInstance, createTextInstance, appendInitialChild
- feat(react-reconciler): support for handling HostRoot, HostComponent and HostText in beginWork
- feat(react-reconciler): add createFiberFromElement in fiber.ts
- feat(react-reconciler): add subtreeFlags in FiberNode
- feat(react-reconciler): add appendAllChildren for offscreen rendering
- feat(react-reconciler): add ChildReconciler for reconciling child of wip fiber tree
- feat(react-reconciler): support for bubbling flags in bubbleProperties function
- chore(react-reconciler): add reconciler.d.ts and declare the type of **DEV** global value
- feat(react-reconciler): record finishedWork when workLoop finished

## 0.0.2

### Patch Changes

- feat: 搭建更新流程基本骨架并实现 mount 流程

## 0.0.1

### Patch Changes

- feat: define FiberNode class
- feat: setup basic workflow
- feat: define WorkTag enum
- feat: define fiber Flags
