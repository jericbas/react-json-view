import type { ThemeObject } from '../../types';
import { themesInverted } from './themesInverted';
import { themesPart1 } from './themesPart1';
import { themesPart2 } from './themesPart2';
import { themesPart3 } from './themesPart3';
import { themesPart4 } from './themesPart4';

export const base16Themes: Record<string, ThemeObject> = {
  ...themesPart1,
  ...themesPart2,
  ...themesPart3,
  ...themesPart4,
  ...themesInverted
};
