# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

**Use `pnpm` as a package manager.**

- To install the dependencies:
```bash
pnpm install
```
- To start the dev server
```bash
pnpm run dev
```
- To build the app-
```bash
pnpm run build
```
- To locally preview production build:
```bash
pnpm run preview
```

## Contribution guides

This repository is a boilerplate for the Nuxt projects. So, developers must follow these guidelines while contributing to the codebase-
#### Branch naming convention-
- Branches that include the setup or configuration of any dependency should start with `setup/` and be followed by hyphenated words. For example-
```
setup/eslint-and-prettier
setup/typescript
```
- Branches that include the feature implementation, should start with `feature/` and be followed by hyphenated words. For example-
```
feature/user-management-apis
setup/payment-screen
```
- Branches that include the bug fix, should start with `bugfix/` and be followed by hyphenated words. For example-
```
bugfix/token-expired-in-every-ten-seconds
bugfix/infinite-loop-while-route-to-login
```

#### Pull requests procedure-

- Before pushing the code, make sure to run all the below commands to ensure that code standards are being followed and build is working properly -
```
pnpm run format
pnpm run lint
pnpm run build
```
- Always raise a PR of your development branch for every  task related to setup/features/bugs. (it should not be the main branch) 
- Every PR should include the following information-
  -  What does this PR do?
  -  Make sure that you've tested all the consequences before you submit PR.
  -  Which issue (ticket number or issue explanation) is this PR fix?
  -  Any reference links of any documentation, article, or stack overflow answer you followed to fix any issue or to implement any feature?
- Apply a relevant label to the PR.
- Assign a reviewer to the PR.
