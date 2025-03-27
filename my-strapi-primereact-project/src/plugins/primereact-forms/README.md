
# Strapi PrimeReact Forms Plugin

A comprehensive Strapi plugin that integrates PrimeReact components for enhanced content management system (CMS) functionality, focusing on creating a flexible and feature-rich form builder and content management interface.

## Features

- Advanced PrimeReact form components
- Dynamic, customizable form creation
- Robust field validation and configuration
- Form templates and presets
- User management extensions
- Performance optimizations

## Installation

```bash
yarn add @strapi/strapi-plugin-primereact-forms
```

## Configuration

Add the plugin to your `config/plugins.js` file:

```js
module.exports = {
  'primereact-forms': {
    enabled: true,
    resolve: './src/plugins/primereact-forms'
  },
};
```
