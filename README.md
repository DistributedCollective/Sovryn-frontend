# Sovryn App

---

[![buddy pipeline](https://app.buddy.works/sovryn/sovryn-frontend/pipelines/pipeline/280478/badge.svg?token=ed1cb69cbee6a52696a31b1f9060030fefe88ab6573a2f51dd45064a1470eeb7 'buddy pipeline')](https://app.buddy.works/sovryn/sovryn-frontend/pipelines/pipeline/280478)

## Install & Start

Make sure you use at least 10 version of node.js.

Install packages:

```shell
yarn
```

Start app for development:

```shell
yarn start
```

A development server will be available on https://localhost:3000 If you're using Chrome, you will get a net::ERR_CERT_AUTHORITY_INVALID warning. To disable it you can your settings in chrome: chrome://flags/#allow-insecure-localhost


Build for production:

```shell
yarn build
```

## Components vs Containers

Containers are responsible on how things work and components on how things look.
Think about containers as pages or stateful wrappers that holds components and components as buttons, inputs, cards, etc.

## Environment variables

You can use .env.local file for env variables while developing.
Variable should be prefixed by `REACT_APP_` to be accessible by react application.
For example `REACT_APP_BASE_URL=http://test.app` can be retrieved by `process.env.REACT_APP_BASE_URL`

.env.local, .env.production and etc files should contain default configuration that all team members are using,
if you need some custom settings then copy .env.local file, name it .env and edit as needed. .env file can't be committed and will prevent configuration overwrites for other developers.

## Generators

Project uses generators (./internals/generators) to speed up component & container creation.

For example if you want to create new component run fallowing command:

```shell
yarn generate component PhoneInput
```

Generator then will ask couple of questions and create component named PhoneInput with contents that will be good starting point.

Generate container:

```shell
yarn generate container LoginPage
```

## Features

<dl>

  <dt>Predictable state management</dt>
  <dd>Unidirectional data flow allows for change logging and time travel debugging.</dd>

  <dt>Instant feedback</dt>
  <dd>Enjoy the best DX (Developer eXperience) and code your app at the speed of thought! Your saved changes to the CSS and JS are reflected instantaneously without refreshing the page. Preserve application state even when you update something in the underlying code!</dd>

  <dt>Next generation CSS</dt>
  <dd>Write composable CSS that's co-located with your components for complete modularity. Unique generated class names keep the specificity low while eliminating style clashes. Ship only the styles that are on the page for the best performance.</dd>

  <dt>Industry-standard routing</dt>
  <dd>It's natural to want to add pages (e.g. `/about`) to your application, and routing makes this possible.</dd>

  <dt>Industry-standard i18n internationalization support</dt>
  <dd>Scalable apps need to support multiple languages, easily add and support multiple languages.</dd>

  <dt>Typescript</dt>
  <dd>Typescript is the key to scalability. Build self-documented code, easy-to-debug code and create maintainable large applications and codebases with a highly productive development experience.</dd>

  <dt>Quick scaffolding</dt>
  <dd>Create components, containers, routes, selectors and sagas - and their tests - right from the CLI!</dd>

  <dt>Static code analysis</dt>
  <dd>Focus on writing new features without worrying about formatting or code quality. With the right editor setup, your code will automatically be formatted and linted as you work.</dd>

  <dt>SEO</dt>
  <dd>We support SEO (document head tags management) for search engines that support indexing of JavaScript content. (eg. Google)</dd>
</dl>

But wait... there's more!

- _The best test setup:_ Automatically guarantee code quality and non-breaking
  changes. (Seen a react app with 100% test coverage before?)
- _The fastest fonts:_ Say goodbye to vacant text.
- _Stay fast_: Profile your app's performance from the comfort of your command
  line!
