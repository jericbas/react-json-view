import type React from 'react';
import { use, useCallback, useEffect, useId, useMemo, useReducer, useRef } from 'react';
import JsonViewer from './components/JsonViewer';
import AddKeyRequest from './components/ObjectKeyModal/AddKeyRequest';
import ValidationFailure from './components/ValidationFailure';
import type {
    JsonViewAction,
    JsonViewContextValue,
    JsonViewState
} from './context/JsonViewContext';
import {
    JsonViewContext,
    jsonViewReducer,
    updateSrc,
    useJsonView
} from './context/JsonViewContext';
import { isTheme, toType } from './helpers/util';
import Theme from './themes/getStyle';
import type { InteractionProps, ReactJsonViewProps, ThemeKeys, ThemeObject } from './types';

export * from './types';
export type { JsonViewAction, JsonViewContextValue, JsonViewState };
export { JsonViewContext, jsonViewReducer, useJsonView };

interface ValidatedProps {
    src: any;
    name: string | null | false;
    theme: ThemeKeys | ThemeObject;
    validationMessage: string;
}

function isPromise<T = any>(val: any): val is Promise<T> {
    return (
        val !== null &&
        (typeof val === 'object' || typeof val === 'function') &&
        typeof (val as any).then === 'function'
    );
}

function validateProps(
    srcProp: any,
    nameProp: string | null | false,
    themeProp: ThemeKeys | ThemeObject | undefined,
    validationMessageProp: string | undefined
): ValidatedProps {
    let theme: ThemeKeys | ThemeObject = themeProp ?? 'rjv-default';
    if (toType(theme) === 'object' && !isTheme(theme)) {
        console.error(
            'react-json-view error:',
            'theme prop must be a theme name or valid base-16 theme object.',
            'defaulting to "rjv-default" theme'
        );
        theme = 'rjv-default';
    }

    let src = srcProp;
    let name = nameProp;
    if (toType(src) !== 'object' && toType(src) !== 'array') {
        console.error('react-json-view error:', 'src property must be a valid json object');
        name = 'ERROR';
        src = {
            message: 'src property must be a valid json object'
        };
    }

    return {
        src,
        name,
        theme,
        validationMessage: validationMessageProp ?? 'Validation Error'
    };
}

export const ReactJsonView: React.FC<ReactJsonViewProps> = ({
    src: srcProp = {},
    name: nameProp = 'root',
    theme: themeProp = 'rjv-default',
    collapsed = false,
    collapseStringsAfterLength = false,
    shouldCollapse = false,
    sortKeys = false,
    quotesOnKeys = true,
    groupArraysAfterLength = 100,
    indentWidth = 4,
    enableClipboard = true,
    displayObjectSize = true,
    displayDataTypes = true,
    onEdit = false,
    onDelete = false,
    onAdd = false,
    onSelect = false,
    iconStyle = 'triangle',
    style = {},
    validationMessage: validationMessageProp = 'Validation Error',
    defaultValue = null,
    displayArrayKey = true
}) => {
    // React 19: unwrap Promise if src is thenable using native use() hook
    const resolvedSrc = isPromise(srcProp) ? use(srcProp) : srcProp;

    // React 19: generate stable unique ID using native useId() hook
    const rawId = useId();
    const rjvId = rawId.replace(/:/g, '') || 'rjv';

    const validated = validateProps(resolvedSrc, nameProp, themeProp, validationMessageProp);

    const [state, reducerDispatch] = useReducer(jsonViewReducer, {
        src: validated.src,
        name: validated.name,
        theme: validated.theme,
        validationMessage: validated.validationMessage,
        addKeyRequest: null,
        validationFailure: false,
        expanded: {},
        collapsed: {}
    });

    const prevPropsRef = useRef({
        src: resolvedSrc,
        name: nameProp,
        theme: themeProp,
        validationMessage: validationMessageProp
    });

    useEffect(() => {
        if (
            resolvedSrc !== prevPropsRef.current.src ||
            nameProp !== prevPropsRef.current.name ||
            themeProp !== prevPropsRef.current.theme ||
            validationMessageProp !== prevPropsRef.current.validationMessage
        ) {
            prevPropsRef.current = {
                src: resolvedSrc,
                name: nameProp,
                theme: themeProp,
                validationMessage: validationMessageProp
            };
            const updated = validateProps(resolvedSrc, nameProp, themeProp, validationMessageProp);
            reducerDispatch({
                type: 'RESET_PROPS',
                payload: updated
            });
        }
    }, [resolvedSrc, nameProp, themeProp, validationMessageProp]);

    const callbacksRef = useRef({
        onAdd,
        onEdit,
        onDelete,
        src: state.src
    });
    callbacksRef.current = {
        onAdd,
        onEdit,
        onDelete,
        src: state.src
    };

    const dispatch = useCallback(
        (action: JsonViewAction) => {
            const actionType = action.type || (action as any).name;
            const actionData = action.payload !== undefined ? action.payload : (action as any).data;

            if (
                actionType === 'VARIABLE_UPDATED' ||
                actionType === 'VARIABLE_ADDED' ||
                actionType === 'VARIABLE_REMOVED'
            ) {
                const updated_src = updateSrc(state.src, actionData);
                const { onAdd: cbAdd, onEdit: cbEdit, onDelete: cbDelete } = callbacksRef.current;
                let callback: any;
                if (actionType === 'VARIABLE_ADDED') callback = cbAdd;
                else if (actionType === 'VARIABLE_UPDATED') callback = cbEdit;
                else if (actionType === 'VARIABLE_REMOVED') callback = cbDelete;

                const on_edit_payload: InteractionProps = {
                    existing_src: state.src,
                    new_value: actionData.new_value,
                    updated_src: updated_src,
                    name: actionData.name,
                    namespace: actionData.namespace,
                    existing_value: actionData.existing_value
                };

                const result =
                    typeof callback === 'function' ? callback(on_edit_payload) : undefined;
                if (result === false) {
                    reducerDispatch({ type: 'VALIDATION_FAILURE' });
                } else {
                    reducerDispatch({
                        type: 'SRC_UPDATED',
                        payload: updated_src
                    });
                }
            } else {
                reducerDispatch(action);
            }
        },
        [state.src]
    );

    const setExpanded = useCallback((key: string, expanded: boolean) => {
        reducerDispatch({ type: 'SET_EXPANDED', payload: { key, expanded } });
    }, []);

    const toggleExpanded = useCallback((key: string, defaultExpanded?: boolean) => {
        reducerDispatch({ type: 'TOGGLE_EXPANDED', payload: { key, defaultExpanded } });
    }, []);

    const setCollapsed = useCallback((key: string, collapsed: boolean) => {
        reducerDispatch({ type: 'SET_COLLAPSED', payload: { key, collapsed } });
    }, []);

    const toggleCollapsed = useCallback((key: string) => {
        reducerDispatch({ type: 'TOGGLE_COLLAPSED', payload: { key } });
    }, []);

    const contextValue = useMemo<JsonViewContextValue>(
        () => ({
            rjvId,
            src: state.src,
            name: state.name,
            theme: state.theme,
            validationMessage: state.validationMessage,
            addKeyRequest: state.addKeyRequest,
            validationFailure: state.validationFailure,
            expanded: state.expanded,
            collapsed: state.collapsed,
            dispatch,
            setExpanded,
            toggleExpanded,
            setCollapsed,
            toggleCollapsed
        }),
        [
            rjvId,
            state.src,
            state.name,
            state.theme,
            state.validationMessage,
            state.addKeyRequest,
            state.validationFailure,
            state.expanded,
            state.collapsed,
            dispatch,
            setExpanded,
            toggleExpanded,
            setCollapsed,
            toggleCollapsed
        ]
    );

    return (
        <JsonViewContext.Provider value={contextValue}>
            <div
                className="react-json-view"
                style={{ ...Theme(state.theme, 'app-container').style, ...style }}
            >
                <ValidationFailure />
                <JsonViewer
                    collapsed={collapsed}
                    collapseStringsAfterLength={collapseStringsAfterLength}
                    shouldCollapse={shouldCollapse}
                    sortKeys={sortKeys}
                    quotesOnKeys={quotesOnKeys}
                    groupArraysAfterLength={groupArraysAfterLength}
                    indentWidth={indentWidth}
                    enableClipboard={enableClipboard}
                    displayObjectSize={displayObjectSize}
                    displayDataTypes={displayDataTypes}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onAdd={onAdd}
                    onSelect={onSelect}
                    iconStyle={iconStyle}
                    style={style}
                    defaultValue={defaultValue}
                    displayArrayKey={displayArrayKey}
                />
                <AddKeyRequest defaultValue={defaultValue} />
            </div>
        </JsonViewContext.Provider>
    );
};

export default ReactJsonView;
