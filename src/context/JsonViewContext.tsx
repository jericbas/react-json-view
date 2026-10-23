import { createContext, use } from 'react';
import { toType } from '../helpers/util';
import type { ThemeKeys, ThemeObject } from '../types';

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

export function deepCopy(src: any, copy_namespace: Array<string | number>): any {
    const type = toType(src);
    let result: any;
    const idx = copy_namespace.shift();
    if (type === 'array') {
        result = [...src];
    } else if (type === 'object') {
        result = { ...src };
    }
    if (idx !== undefined && result !== undefined) {
        result[idx] = deepCopy(src[idx], copy_namespace);
    }
    return result;
}

export function updateSrc(src: any, request: any): any {
    const { name, new_value, variable_removed } = request;
    const namespace = [...request.namespace];

    namespace.shift();

    // deeply copy src
    let updated_src = deepCopy(src, [...namespace]);

    // point at current index
    let walk: any = updated_src;
    for (const idx of namespace) {
        walk = walk[idx];
    }

    if (variable_removed) {
        if (toType(walk) === 'array') {
            walk.splice(name, 1);
        } else {
            delete walk[name];
        }
    } else {
        // update copied variable at specified namespace
        if (name !== null && name !== undefined) {
            walk[name] = new_value;
        } else {
            updated_src = new_value;
        }
    }

    return updated_src;
}

export function jsonViewReducer(state: JsonViewState, action: JsonViewAction): JsonViewState {
    const actionType = action.type || (action as any).name;
    const actionData = action.payload !== undefined ? action.payload : (action as any).data;

    switch (actionType) {
        case 'VARIABLE_UPDATED':
        case 'VARIABLE_ADDED':
        case 'VARIABLE_REMOVED': {
            if (!actionData) return state;
            const updated_src = updateSrc(state.src, actionData);
            return {
                ...state,
                src: updated_src,
                validationFailure: false,
                addKeyRequest: null
            };
        }
        case 'SRC_UPDATED': {
            return {
                ...state,
                src: actionData,
                validationFailure: false,
                addKeyRequest: null
            };
        }
        case 'ADD_VARIABLE_KEY_REQUEST': {
            return {
                ...state,
                addKeyRequest: actionData
            };
        }
        case 'RESET': {
            return {
                ...state,
                validationFailure: false,
                addKeyRequest: null
            };
        }
        case 'VALIDATION_FAILURE': {
            return {
                ...state,
                validationFailure: true
            };
        }
        case 'SET_EXPANDED': {
            if (!actionData) return state;
            return {
                ...state,
                expanded: {
                    ...state.expanded,
                    [actionData.key]: actionData.expanded
                }
            };
        }
        case 'TOGGLE_EXPANDED': {
            if (!actionData) return state;
            const current =
                state.expanded[actionData.key] !== undefined
                    ? state.expanded[actionData.key]
                    : Boolean(actionData.defaultExpanded);
            return {
                ...state,
                expanded: {
                    ...state.expanded,
                    [actionData.key]: !current
                }
            };
        }
        case 'SET_COLLAPSED': {
            if (!actionData) return state;
            return {
                ...state,
                collapsed: {
                    ...state.collapsed,
                    [actionData.key]: actionData.collapsed
                }
            };
        }
        case 'TOGGLE_COLLAPSED': {
            if (!actionData) return state;
            const current =
                state.collapsed[actionData.key] !== undefined
                    ? state.collapsed[actionData.key]
                    : true;
            return {
                ...state,
                collapsed: {
                    ...state.collapsed,
                    [actionData.key]: !current
                }
            };
        }
        case 'RESET_PROPS': {
            if (!actionData) return state;
            return {
                ...state,
                src: actionData.src !== undefined ? actionData.src : state.src,
                name: actionData.name !== undefined ? actionData.name : state.name,
                theme: actionData.theme !== undefined ? actionData.theme : state.theme,
                validationMessage:
                    actionData.validationMessage !== undefined
                        ? actionData.validationMessage
                        : state.validationMessage
            };
        }
        default:
            return state;
    }
}

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
