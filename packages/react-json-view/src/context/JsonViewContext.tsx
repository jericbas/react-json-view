import { createContext, use } from 'react';
import { deepCopy, updateSrc } from '../helpers/updateSrc';
import type { ThemeKeys, ThemeObject } from '../types';
import { jsonViewReducer } from './jsonViewReducer';

export { deepCopy, jsonViewReducer, updateSrc };

export interface JsonViewState {
  src: any;
  name: string | null | false;
  theme: ThemeKeys | ThemeObject;
  validationMessage: string;
  addKeyRequest: {
    existing_value: any;
    namespace: Array<string | number | null>;
    name: string | number | null;
    [key: string]: any;
  } | null;
  validationFailure: boolean;
  expanded: Record<string, boolean>;
  collapsed: Record<string, boolean>;
}

export type JsonViewAction =
  | { type: 'VARIABLE_UPDATED'; payload?: any; data?: any }
  | { type: 'VARIABLE_ADDED'; payload?: any; data?: any }
  | { type: 'VARIABLE_REMOVED'; payload?: any; data?: any }
  | { type: 'ADD_VARIABLE_KEY_REQUEST'; payload?: any; data?: any }
  | { type: 'RESET'; payload?: any; data?: any }
  | {
      type: 'SET_EXPANDED';
      payload?: { key: string; expanded: boolean };
      data?: { key: string; expanded: boolean };
    }
  | {
      type: 'TOGGLE_EXPANDED';
      payload?: { key: string; defaultExpanded?: boolean | undefined };
      data?: { key: string; defaultExpanded?: boolean | undefined };
    }
  | {
      type: 'SET_COLLAPSED';
      payload?: { key: string; collapsed: boolean };
      data?: { key: string; collapsed: boolean };
    }
  | { type: 'TOGGLE_COLLAPSED'; payload?: { key: string }; data?: { key: string } }
  | { type: 'RESET_PROPS'; payload?: Partial<JsonViewState>; data?: Partial<JsonViewState> }
  | { type: 'VALIDATION_FAILURE'; payload?: boolean; data?: boolean }
  | { type: 'SRC_UPDATED'; payload?: any; data?: any }
  | {
      type?: string;
      name?: string;
      data?: any;
      payload?: any;
      rjvId?: string;
      [key: string]: any;
    };

export interface JsonViewContextValue {
  rjvId: string;
  src: any;
  name: string | null | false;
  theme: ThemeKeys | ThemeObject;
  validationMessage: string;
  addKeyRequest: any | null;
  validationFailure: boolean;
  expanded: Record<string, boolean>;
  collapsed: Record<string, boolean>;
  dispatch: (action: JsonViewAction) => void;
  setExpanded: (key: string, expanded: boolean) => void;
  toggleExpanded: (key: string, defaultExpanded?: boolean) => void;
  setCollapsed: (key: string, collapsed: boolean) => void;
  toggleCollapsed: (key: string) => void;
}

export const defaultContextValue: JsonViewContextValue = {
  rjvId: '',
  src: {},
  name: 'root',
  theme: 'rjv-default',
  validationMessage: 'Validation Error',
  addKeyRequest: null,
  validationFailure: false,
  expanded: {},
  collapsed: {},
  dispatch: () => {},
  setExpanded: () => {},
  toggleExpanded: () => {},
  setCollapsed: () => {},
  toggleCollapsed: () => {}
};

export const JsonViewContext = createContext<JsonViewContextValue>(defaultContextValue);

export function useJsonView(): JsonViewContextValue {
  return use(JsonViewContext);
}
