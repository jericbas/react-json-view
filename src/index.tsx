import React, { useId, useState, useEffect, useRef, useCallback } from 'react';
import JsonViewer from './components/JsonViewer';
import AddKeyRequest from './components/ObjectKeyModal/AddKeyRequest';
import ValidationFailure from './components/ValidationFailure';
import { isTheme, toType } from './helpers/util';
import ObjectAttributes from './stores/ObjectAttributes';
import Theme from './themes/getStyle';
import type {
    InteractionProps,
    ReactJsonViewProps,
    ThemeKeys,
    ThemeObject
} from './types';

export * from './types';

interface ValidatedProps {
    src: any;
    name: string | null | false;
    theme: ThemeKeys | ThemeObject;
    validationMessage: string;
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
        console.error(
            'react-json-view error:',
            'src property must be a valid json object'
        );
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
    const rawId = useId();
    // Normalize id to safe identifier
    const rjvId = useRef(rawId.replace(/:/g, '') || Date.now().toString()).current;

    const validated = validateProps(
        srcProp,
        nameProp,
        themeProp,
        validationMessageProp
    );

    const [src, setSrc] = useState<any>(validated.src);
    const [name, setName] = useState<string | null | false>(validated.name);
    const [theme, setTheme] = useState<ThemeKeys | ThemeObject>(validated.theme);
    const [validationMessage, setValidationMessage] = useState<string>(
        validated.validationMessage
    );
    const [addKeyRequest, setAddKeyRequest] = useState<boolean>(false);
    const [validationFailure, setValidationFailure] = useState<boolean>(false);

    // Track previous props to update state when parent re-renders with new props
    const prevSrcPropRef = useRef(srcProp);
    const prevNamePropRef = useRef(nameProp);
    const prevThemePropRef = useRef(themeProp);

    if (
        srcProp !== prevSrcPropRef.current ||
        nameProp !== prevNamePropRef.current ||
        themeProp !== prevThemePropRef.current
    ) {
        prevSrcPropRef.current = srcProp;
        prevNamePropRef.current = nameProp;
        prevThemePropRef.current = themeProp;

        const updated = validateProps(
            srcProp,
            nameProp,
            themeProp,
            validationMessageProp
        );
        setSrc(updated.src);
        setName(updated.name);
        setTheme(updated.theme);
        setValidationMessage(updated.validationMessage);
    }

    const callbacksRef = useRef({
        onAdd,
        onEdit,
        onDelete,
        src
    });
    callbacksRef.current = {
        onAdd,
        onEdit,
        onDelete,
        src
    };

    const updateSrc = useCallback(() => {
        const actionData = ObjectAttributes.get(
            rjvId,
            'action',
            'variable-update'
        );
        if (!actionData) return;

        const {
            name: varName,
            namespace,
            new_value,
            existing_value,
            updated_src,
            type
        } = actionData;

        const {
            onAdd: cbAdd,
            onEdit: cbEdit,
            onDelete: cbDelete,
            src: currentSrc
        } = callbacksRef.current;

        let result: any;

        const on_edit_payload: InteractionProps = {
            existing_src: currentSrc,
            new_value: new_value,
            updated_src: updated_src,
            name: varName,
            namespace: namespace,
            existing_value: existing_value
        };

        switch (type) {
            case 'variable-added':
                result = typeof cbAdd === 'function' ? cbAdd(on_edit_payload) : undefined;
                break;
            case 'variable-edited':
                result = typeof cbEdit === 'function' ? cbEdit(on_edit_payload) : undefined;
                break;
            case 'variable-removed':
                result = typeof cbDelete === 'function' ? cbDelete(on_edit_payload) : undefined;
                break;
        }

        if (result !== false) {
            ObjectAttributes.set(rjvId, 'global', 'src', updated_src);
            setSrc(updated_src);
        } else {
            setValidationFailure(true);
        }
    }, [rjvId]);

    const handleAddKeyRequest = useCallback(() => {
        setAddKeyRequest(true);
    }, []);

    const resetState = useCallback(() => {
        setValidationFailure(false);
        setAddKeyRequest(false);
    }, []);

    useEffect(() => {
        ObjectAttributes.set(rjvId, 'global', 'src', src);

        const resetEvent = 'reset-' + rjvId;
        const updateEvent = 'variable-update-' + rjvId;
        const addKeyEvent = 'add-key-request-' + rjvId;

        ObjectAttributes.on(resetEvent, resetState);
        ObjectAttributes.on(updateEvent, updateSrc);
        ObjectAttributes.on(addKeyEvent, handleAddKeyRequest);

        return () => {
            ObjectAttributes.removeListener(resetEvent, resetState);
            ObjectAttributes.removeListener(updateEvent, updateSrc);
            ObjectAttributes.removeListener(addKeyEvent, handleAddKeyRequest);
        };
    }, [rjvId, resetState, updateSrc, handleAddKeyRequest]);

    useEffect(() => {
        ObjectAttributes.set(rjvId, 'global', 'src', src);
    }, [rjvId, src]);

    return (
        <div
            className="react-json-view"
            style={{ ...Theme(theme, 'app-container').style, ...style }}
        >
            <ValidationFailure
                message={validationMessage}
                active={validationFailure}
                theme={theme}
                rjvId={rjvId}
            />
            <JsonViewer
                src={src}
                name={name}
                theme={theme}
                type={toType(src)}
                rjvId={rjvId}
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
                validationMessage={validationMessage}
                defaultValue={defaultValue}
                displayArrayKey={displayArrayKey}
            />
            <AddKeyRequest
                active={addKeyRequest}
                theme={theme}
                rjvId={rjvId}
                defaultValue={defaultValue}
            />
        </div>
    );
};

export default ReactJsonView;
