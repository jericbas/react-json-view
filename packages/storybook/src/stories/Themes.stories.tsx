import type { Meta, StoryObj } from '@storybook/react';
import ReactJson, { type ThemeObject } from 'react-json-view';

const sampleObject = {
  themeName: 'preview',
  version: 19,
  features: ['native hooks', 'zero dependencies', 'strict TypeScript'],
  config: {
    dark: true,
    accent: '#01a1dd'
  }
};

const customCyberpunkTheme: ThemeObject = {
  scheme: 'cyberpunk',
  author: 'react-json-view',
  base00: '#000b1e',
  base01: '#051937',
  base02: '#0b2e59',
  base03: '#1a4980',
  base04: '#3273a8',
  base05: '#00e5ff',
  base06: '#76ffff',
  base07: '#ffffff',
  base08: '#ff0055',
  base09: '#ff7700',
  base0A: '#ffe600',
  base0B: '#00ff66',
  base0C: '#00ffff',
  base0D: '#0088ff',
  base0E: '#cc00ff',
  base0F: '#ff00aa'
};

const meta: Meta<typeof ReactJson> = {
  title: 'Themes/Base16Themes',
  component: ReactJson
};

export default meta;
type Story = StoryObj<typeof ReactJson>;

export const Monokai: Story = {
  args: {
    src: sampleObject,
    name: 'monokai',
    theme: 'monokai'
  }
};

export const Solarized: Story = {
  args: {
    src: sampleObject,
    name: 'solarized',
    theme: 'solarized'
  }
};

export const Ocean: Story = {
  args: {
    src: sampleObject,
    name: 'ocean',
    theme: 'ocean'
  }
};

export const CustomThemeObject: Story = {
  args: {
    src: sampleObject,
    name: 'cyberpunk-custom',
    theme: customCyberpunkTheme
  }
};
