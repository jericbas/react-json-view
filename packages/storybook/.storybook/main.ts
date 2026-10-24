import path from 'node:path';
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  async viteFinal(config) {
    const rjvEntry = path.resolve(process.cwd(), '../react-json-view/src/index.ts');
    const clipboardEntry = path.resolve(
      process.cwd(),
      '../react-json-view/src/plugins/clipboard/index.ts'
    );
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-json-view/plugins/clipboard': clipboardEntry,
      'react-json-view': rjvEntry
    };
    return config;
  }
};

export default config;
