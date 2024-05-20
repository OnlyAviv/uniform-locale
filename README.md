# eslint-plugin-uniform-locale

## Overview

`eslint-plugin-uniform-locale` is an ESLint plugin that enforces consistent spelling based on the specified locale. This helps maintain a uniform style across your codebase by ensuring that words are spelled according to either US or GB English conventions.

## Installation

To install the plugin, use either npm or yarn:

```bash
npm install eslint-plugin-uniform-locale --save-dev
```

or

```bash
yarn add eslint-plugin-uniform-locale --dev
```

## Usage

Add `uniform-locale` to the `plugins` array in your ESLint configuration file, and configure the rule under `rules`. You also need to specify the desired locale (either 'US' or 'GB') in the rule options.

```json
{
  "plugins": ["uniform-locale"],
  "rules": {
    "uniform-locale/consistent-spelling": ["error", "US"]
  }
}
```

## Configuration

The plugin accepts a single configuration option to specify the locale. The available options are:

- `"US"`: Enforces US English spelling conventions.
- `"GB"`: Enforces GB English spelling conventions.

### Example Configuration

```json
{
  "plugins": ["uniform-locale"],
  "rules": {
    "uniform-locale/consistent-spelling": ["error", "GB"]
  }
}
```

## Rule Details

### `consistent-spelling`

This rule checks for spelling consistency based on the specified locale and suggests corrections if discrepancies are found.

- **Type**: Suggestion
- **Category**: Stylistic Issues
- **Recommended**: Yes
- **Fixable**: Yes (automatic fix available)
- **Has Suggestions**: Yes (provides suggestions for correct spelling)

#### Options

- **`"US"`**: Enforce US English spelling.
- **`"GB"`**: Enforce GB English spelling.

### Examples

#### Correct (US)

```js
// ESLint configuration: ["error", "US"]

const color = 'blue';
const analyze = () => {};
```

#### Incorrect (US)

```js
// ESLint configuration: ["error", "US"]

const colour = 'blue'; // should be 'color'
const analyse = () => {}; // should be 'analyze'
```

#### Correct (GB)

```js
// ESLint configuration: ["error", "GB"]

const colour = 'blue';
const analyse = () => {};
```

#### Incorrect (GB)

```js
// ESLint configuration: ["error", "GB"]

const color = 'blue'; // should be 'colour'
const analyze = () => {}; // should be 'analyse'
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue if you encounter any problems or have suggestions for improvements.