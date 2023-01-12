# plasticine-react

Build my own react. ⚡

## Features

### Engineering

| Type                | Content                                            | Status | in which version                                                                                            |
| ------------------- | -------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------- |
| repositry structure | monorepo (powered by pnpm workspace)               | ☑️     | [react@0.0.1](https://github.com/Plasticine-Yang/plasticine-react/tree/react%400.0.1)                       |
| standard            | eslint                                             | ☑️     | [react@0.0.1](https://github.com/Plasticine-Yang/plasticine-react/tree/react%400.0.1)                       |
| standard            | prettier                                           | ☑️     | [react@0.0.1](https://github.com/Plasticine-Yang/plasticine-react/tree/react%400.0.1)                       |
| standard            | commitlint, commitizen, cz-git, husky, lint-staged | ☑️     | [react@0.0.1](https://github.com/Plasticine-Yang/plasticine-react/tree/react%400.0.1)                       |
| build               | rollup                                             | ☑️     | [cli@0.1.2](https://github.com/Plasticine-Yang/plasticine-react/tree/cli%400.1.2)                           |
| build               | `__DEV__` 全局标识区分开发环境                     | ☑️     | [react-reconciler@0.0.3](https://github.com/Plasticine-Yang/plasticine-react/tree/react-reconciler%400.0.3) |
| unit-test           | jest                                               | ️🔳    |                                                                                                             |
| deploy              | github action                                      | 🔳     |                                                                                                             |

### Framework

| Package    | Content                      | Status | in which version                                                                                            |
| ---------- | ---------------------------- | ------ | ----------------------------------------------------------------------------------------------------------- |
| react      | JSX Runtime                  | ☑️     | [react@0.0.1](https://github.com/Plasticine-Yang/plasticine-react/tree/react%400.0.1)️                      |
| reconciler | Fiber                        | ☑️     | [react-reconciler@0.0.1](https://github.com/Plasticine-Yang/plasticine-react/tree/react-reconciler%400.0.1) |
| reconciler | FiberRoot                    | ☑️     | [react-reconciler@0.0.2](https://github.com/Plasticine-Yang/plasticine-react/tree/react-reconciler%400.0.2) |
| reconciler | 基础 Update 流程             | ☑️     | [react-reconciler@0.0.2](https://github.com/Plasticine-Yang/plasticine-react/tree/react-reconciler%400.0.2) |
| reconciler | render 阶段 HostRoot         | ☑️     | [react-reconciler@0.0.3](https://github.com/Plasticine-Yang/plasticine-react/tree/react-reconciler%400.0.3) |
| reconciler | render 阶段 HostComponent    | ☑️     | [react-reconciler@0.0.3](https://github.com/Plasticine-Yang/plasticine-react/tree/react-reconciler%400.0.3) |
| reconciler | render 阶段 HostText         | ☑️     | [react-reconciler@0.0.3](https://github.com/Plasticine-Yang/plasticine-react/tree/react-reconciler%400.0.3) |
| reconciler | render 阶段 mount 时离屏渲染 | ☑️     | [react-reconciler@0.0.3](https://github.com/Plasticine-Yang/plasticine-react/tree/react-reconciler%400.0.3) |
| reconciler | beginWork                    | ☑️     | [react-reconciler@0.0.3](https://github.com/Plasticine-Yang/plasticine-react/tree/react-reconciler%400.0.3) |
| reconciler | completeWork                 | ☑️     | [react-reconciler@0.0.3](https://github.com/Plasticine-Yang/plasticine-react/tree/react-reconciler%400.0.3) |
| playground | play                         | ☑️     | [react-reconciler@0.0.1](https://github.com/Plasticine-Yang/plasticine-react/tree/react-reconciler%400.0.1) |

## Usage

You can build all packages or specified package by the cli in `@plasticine-react/cli`.

### CLI

First, you should build the cli package itself.

```shell
pnpm build:cli
```

Then, you can build all packages by running:

```shell
pnpm build
```

or running:

```shell
npx plasticine-react build
```

And you can also build specified package:

```shell
npx plasticine-react build react
```

### Playground

You can experience the project through playground.

```shell
# execute the command in the project root directory.
pnpm play
```

## Tutorial

Please check [my personal blog site](https://plasticine-yang.github.io/react-source-learning/plasticine-react/introduction.html) for the complete tutorial.
