# plasticine-react

Build my own react. ⚡

## Features

### Engineering

| Type                | Content                                            | Status |
| ------------------- | -------------------------------------------------- | ------ |
| repositry structure | monorepo (powered by pnpm workspace)               | ☑️     |
| standard            | eslint                                             | ☑️     |
| standard            | prettier                                           | ☑️     |
| standard            | commitlint, commitizen, cz-git, husky, lint-staged | ☑️     |
| build               | rollup                                             | ☑️     |
| unit-test           | jest                                               | ️🔳    |
| deploy              | github action                                      | 🔳     |

### Framework

| Package    | Content     | Status |
| ---------- | ----------- | ------ |
| React      | JSX Runtime | ☑️     |
| Reconciler | Fiber       | ☑️     |
| Reconciler | Update      | ☑️     |
| playground | play        | ☑️     |

## Usage

You can build all packages or specified package by the cli in `@plasticine-react/cli`.

### cli

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
