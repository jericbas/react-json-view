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
  args: { src: sampleObject, name: 'monokai', theme: 'monokai' }
};

export const Solarized: Story = {
  args: { src: sampleObject, name: 'solarized', theme: 'solarized' }
};

export const Ocean: Story = {
  args: { src: sampleObject, name: 'ocean', theme: 'ocean' }
};

export const Dracula: Story = {
  args: { src: sampleObject, name: 'dracula', theme: 'dracula' }
};

export const Nord: Story = {
  args: { src: sampleObject, name: 'nord', theme: 'nord' }
};

export const Gruvbox: Story = {
  args: { src: sampleObject, name: 'gruvbox', theme: 'gruvbox' }
};

export const OneDark: Story = {
  args: { src: sampleObject, name: 'onedark', theme: 'onedark' }
};

export const Catppuccin: Story = {
  args: { src: sampleObject, name: 'catppuccin', theme: 'catppuccin' }
};

export const TokyoNight: Story = {
  args: { src: sampleObject, name: 'tokyonight', theme: 'tokyonight' }
};

export const RosePine: Story = {
  args: { src: sampleObject, name: 'rosepine', theme: 'rosepine' }
};

export const Everforest: Story = {
  args: { src: sampleObject, name: 'everforest', theme: 'everforest' }
};

export const Synthwave: Story = {
  args: { src: sampleObject, name: 'synthwave', theme: 'synthwave' }
};

export const NightOwl: Story = {
  args: { src: sampleObject, name: 'nightowl', theme: 'nightowl' }
};

export const Aurora: Story = {
  args: { src: sampleObject, name: 'aurora', theme: 'aurora' }
};

export const Matcha: Story = {
  args: { src: sampleObject, name: 'matcha', theme: 'matcha' }
};

export const Nebula: Story = {
  args: { src: sampleObject, name: 'nebula', theme: 'nebula' }
};

export const Obsidian: Story = {
  args: { src: sampleObject, name: 'obsidian', theme: 'obsidian' }
};

export const Sakura: Story = {
  args: { src: sampleObject, name: 'sakura', theme: 'sakura' }
};

export const CustomThemeObject: Story = {
  args: {
    src: sampleObject,
    name: 'cyberpunk-custom',
    theme: customCyberpunkTheme
  }
};
