![alt text](https://github.com/mac-s-g/react-json-view/blob/master/doc/rjv-icon-alt.png?raw=true)

[![npm](https://img.shields.io/npm/v/react-json-view.svg)](https://www.npmjs.com/package/react-json-view) [![npm](https://img.shields.io/npm/l/react-json-view.svg)](./LICENSE) [![CI](https://github.com/jericbas/react-json-view/actions/workflows/ci.yml/badge.svg)](https://github.com/jericbas/react-json-view/actions/workflows/ci.yml)

# react-json-view

> 🚧 **Under Construction**: This repository is currently undergoing active modernization and development. We are updating the library with complete React 19 support, a TypeScript rewrite, an NPM workspaces monorepo architecture, and automated CI/CD pipelines. Features and documentation are evolving.
>
> 🚀 **Live Storybook Demo & Documentation:** [https://jericbas.github.io/react-json-view/](https://jericbas.github.io/react-json-view/)

RJV is a React component for displaying and editing javascript **arrays** and **JSON objects**.

This component provides a responsive interface for displaying arrays or JSON in a web browser. NPM offers a distribution of the source that's transpiled to ES5; so you can include this component with _any web-based javascript application_.
- 📖 **Storybook Demo:** [https://jericbas.github.io/react-json-view/](https://jericbas.github.io/react-json-view/)
- 📘 **Props Reference:** [Storybook Props Documentation](https://jericbas.github.io/react-json-view/?path=/docs/documentation-props--docs)


### Implementation Example

```tsx
// TypeScript / ES Module
import ReactJson, { type ReactJsonViewProps } from 'react-json-view';

const props: ReactJsonViewProps = {
  src: my_json_object,
  theme: 'monokai',
  collapsed: false
};

// use the component in your app!
<ReactJson {...props} />;
```

Or standard JavaScript:
```jsx
// import the react-json-view component
import ReactJson from 'react-json-view';

// use the component in your app!
<ReactJson src={my_json_object} />;
```

### Async Data Fetching with React 19 `use()` & `<Suspense>`

With React 19, `react-json-view` natively unwraps asynchronous `Promise<object>` values passed directly to the `src` prop using React's `use()` hook! Wrap your `<ReactJson />` component in a React `<Suspense>` boundary to display a fallback while the data is loading:

```tsx
import React, { Suspense } from 'react';
import ReactJson from 'react-json-view';

// Fetch promise
const jsonPromise = fetch('https://api.example.com/data').then(res => res.json());

function AsyncJsonViewer() {
  return (
    <Suspense fallback={<div>Loading JSON data...</div>}>
      <ReactJson src={jsonPromise} theme="monokai" />
    </Suspense>
  );
}
```

### Output Examples

#### Default Theme

![alt text](https://github.com/mac-s-g/react-json-view/blob/master/doc/output-example-15.png?raw=true "Output Example 1")
#### Hopscotch Theme, with Triangle Icons:

![alt text](https://github.com/mac-s-g/react-json-view/blob/master/doc/output-example-14.png?raw=true "Output Example 2")

### Installation Instructions

Install this component with [NPM](https://www.npmjs.com/package/react-json-view). RJV requires React 19+ (`react` and `react-dom` `^19.0.0` as peer dependencies).
```shell
npm install --save react-json-view
```
Ensure you have React 19+ installed in your project:
```shell
npm install react@^19.0.0 react-dom@^19.0.0
```
Or add to your package.json config file:
```json
"dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-json-view": "latest"
}
```

### Props & Documentation

For the complete and interactive props reference, callbacks guide, and live component playground, please visit our **[Storybook Documentation](https://jericbas.github.io/react-json-view/?path=/docs/documentation-props--docs)**.

### Features

- `onEdit`, `onAdd` and `onDelete` props allow users to edit the `src` variable
- Object, array, string and function values can be collapsed and expanded
- Object and array nodes display length
- Object and array nodes support a "Copy to Clipboard" feature
- String values can be truncated after a specified length
- Arrays can be subgrouped after a specified length
- Base-16 Theme Support
- When `onEdit` is enabled:
  - `Ctrl/Cmd+Click` Edit Mode
  - `Ctrl/Cmd+Enter` Submit

### Customizing Style

#### Stock Themes

RJV now supports base-16 themes!

You can specify a `theme` name or object when you instantiate your rjv component.
```jsx
<ReactJson src={my_important_json} theme="monokai" />;
```
Check out the list of supported themes [in the Storybook demo](https://jericbas.github.io/react-json-view/). A custom "rjv-default" theme applies by default.

#### Monokai theme example

![alt text](https://github.com/mac-s-g/react-json-view/blob/master/doc/output-example-monokai-2.png?raw=true "Base-16 Theme Example")

#### Solarized theme example

![alt text](https://github.com/mac-s-g/react-json-view/blob/master/doc/output-example-solarized-2.png?raw=true "Base-16 Theme Example")

#### Use Your Own Theme

You can supply your own base-16 theme object.

To better understand custom themes, take a look at [my example implementation](https://github.com/mac-s-g/react-json-view/blob/7c154b9a7d83ea89dce2c171ebdf4d163ff49233/dev-server/src/index.js#L135) and the [base-16 theme styling guidelines](https://github.com/chriskempson/base16/blob/master/styling.md).

### onEdit, onAdd and onDelete Interaction

Pass callback methods to `onEdit`, `onAdd` and `onDelete` props. Your method will be invoked when a user attempts to update your `src` object.

The following object will be passed to your method:
```js
{
    updated_src: src, //new src value
    name: name, //new var name
    namespace: namespace, //list, namespace indicating var location
    new_value: new_value, //new variable value
    existing_value: existing_value, //existing variable value
}
```

Returning `false` from a callback method will prevent the src from being affected.

### Contributing to the source code

#### Run Storybook (Interactive Demo & Documentation)

```bash
# clone this repository
git clone git@github.com:jericbas/react-json-view.git && cd react-json-view
# install dependencies
npm install
# start the Storybook dev server with hot reloading
npm run storybook
```
Storybook will start the local development server at `http://localhost:6006` with interactive docs and stories.

#### Run the Production Library Build

```bash
# build the library (generates ESM, CJS, and .d.ts in packages/react-json-view/dist/)
npm run build
```

#### Run the Storybook Static Build

```bash
# build the static Storybook documentation site (into packages/storybook/storybook-static/)
npm run build:storybook
```
#### Testing

```bash
# Run unit and component test suite via Vitest
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run End-to-End tests via Playwright
npm run test:e2e
```

#### Linting & Formatting (Biome)

```bash
# Check formatting and lint rules with Biome
npm run check

# Automatically format and fix issues
npm run check:write
```

A zero-dependency Git pre-commit hook in `.githooks/pre-commit` runs `biome check` and `tsc --noEmit` automatically on staged files before each commit.

### Inspiration

I drew a ton of design ideas from [react-json-tree](https://github.com/alexkuz/react-json-tree). Thanks to the RJT contributors for putting together an awesome component!

I'm also inspired by users who come up with interesting feature requests. Reach out to me with ideas for this project or other projects you want to collaborate on. My email address is listed on my [github user page](https://github.com/mac-s-g).
