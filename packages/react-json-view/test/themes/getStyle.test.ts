import { describe, expect, it } from 'vitest';
import getStyle from '../../src/themes/getStyle';

describe('getStyle', () => {
  it('test that style is returned', () => {
    const style = getStyle('rjv-default', 'app-container');
    expect(style.style.cursor).toBe('default');
  });

  it('test objectKeyVal return', () => {
    const style = getStyle('rjv-default', 'objectKeyVal', { paddingLeft: 10 });
    expect(style.style).toBeDefined();
  });

  it('test "none" theme', () => {
    const style = getStyle('none', 'app-container');
    expect(style.style).toBeDefined();
  });

  it('test theme not set (NOTICE OUTPUT EXPECTED)', () => {
    const style = getStyle(false, 'app-container');
    expect(style.style).toBeDefined();
  });

  it('test built-in named theme (monokai)', () => {
    const style = getStyle('monokai', 'app-container');
    expect(style.style.backgroundColor).toBe('#272822');
  });

  it('test built-in inverted theme (apathy:inverted)', () => {
    const style = getStyle('apathy:inverted', 'app-container');
    expect(style.style).toBeDefined();
    expect(style.style.backgroundColor).toBeDefined();
  });

  it('test 10 common built-in themes', () => {
    const expectedBackgrounds: Record<string, string> = {
      dracula: '#282a36',
      nord: '#2e3440',
      gruvbox: '#282828',
      onedark: '#282c34',
      catppuccin: '#1e1e2e',
      tokyonight: '#1a1b26',
      rosepine: '#191724',
      everforest: '#2d353b',
      synthwave: '#262335',
      nightowl: '#011627'
    };

    for (const [themeName, bg] of Object.entries(expectedBackgrounds)) {
      const style = getStyle(themeName as any, 'app-container');
      expect(style.style.backgroundColor).toBe(bg);
    }
  });

  it('test 5 newly invented built-in themes', () => {
    const expectedBackgrounds: Record<string, string> = {
      aurora: '#07111a',
      matcha: '#141d17',
      nebula: '#0d091a',
      obsidian: '#111215',
      sakura: '#1c1219'
    };

    for (const [themeName, bg] of Object.entries(expectedBackgrounds)) {
      const style = getStyle(themeName as any, 'app-container');
      expect(style.style.backgroundColor).toBe(bg);
    }
  });

  it('test custom theme object with custom styling overrides', () => {
    const customTheme = {
      base00: '#112233',
      base01: '#223344',
      base02: '#334455',
      base03: '#445566',
      base04: '#556677',
      base05: '#667788',
      base06: '#778899',
      base07: '#8899aa',
      base08: '#99aabb',
      base09: '#aabbcc',
      base0A: '#bbccdd',
      base0B: '#ccddee',
      base0C: '#ddeeff',
      base0D: '#eeffff',
      base0E: '#ffffff',
      base0F: '#000000',
      'app-container': {
        color: 'purple'
      }
    };
    const style = getStyle(customTheme, 'app-container');
    expect(style.style.backgroundColor).toBe('#112233');
    expect(style.style.color).toBe('purple');
  });
});
