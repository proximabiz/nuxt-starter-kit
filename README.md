# Nuxt 3 starter kit

> Now supporting [Nuxt v3](https://nuxt.com)

**Are you going to create a nuxt project? Want to quickly start with an end-to-end setup? [TRY Nuxt-Starter-Kit!](https://github.com/proximabiz/nuxt-starter-kit)**

### What is included

- [NUXT v3](https://nuxt.com)
- [nuxt UI](https://ui.nuxt.com.com)
- [Validation library- ZOD](https://zod.dev/?id=introduction)
- [antfu/eslint-config](https://github.com/antfu/eslint-config)
- [i18n localization](https://i18n.nuxtjs.org/)
- [Vue Use core](https://vueuse.org/)
- Docker enabled setup
- Dependency upgrade scripts
- Helpful CLI commands
- .VSCode related extensions
- Utility/helper functions

### TODO

- Pinia
- Transition/animation
- Icons, fonts, image
- SEO, sitemap, robots
- Layout
- Custom/shared components
- Composables
- Analytics

## Local setup

**Use `pnpm` as a package manager.**

#### Quick Start

```bash
pnpm setup:local
```

After setup successfully, start the local server-

```bash
pnpm dev
```

#### Manual steps

- To install the dependencies:

```bash
pnpm install
```

- To start the dev server

```bash
pnpm dev
```

- To build the app-

```bash
pnpm build
```

- To check and fix possible lint errors

```bash
pnpm run lint:fix
```

## Contribution guides

Developers must follow these guidelines while contributing to the codebase-

#### Branch naming convention-

- Branches that include the setup or configuration of any dependency should start with `setup/` and be followed by hyphenated words. For example-

```
setup/eslint-and-prettier
setup/typescript
```

- Branches that include the feature implementation, should start with `feature/` and be followed by hyphenated words. For example-

```
feature/user-management-apis
feature/payment-screen
```

- Branches that include the bug fix, should start with `hotfix/` and be followed by hyphenated words. For example-

```
hotfix/token-expired-in-every-ten-seconds
hotfix/infinite-loop-while-route-to-login
```

#### Pull requests procedure-

- Before pushing the code, make sure to run all the below commands to ensure that code standards are being followed and build is working properly -

```
pnpm run format
pnpm run lint
pnpm run lint:fix
pnpm run build
```

- Always raise a PR of your local branch for every task related to setup/features/bugs.
- Every PR should include the following information-
  - What does this PR do?
  - Make sure that you've tested all the consequences before you submit PR.
  - Which issue (ticket number or issue explanation) is this PR fix?
  - Any reference links of any documentation, article, or stack overflow answer you followed to fix any issue or to implement any feature?
- Apply a relevant label to the PR.
- Assign a reviewer to the PR.
