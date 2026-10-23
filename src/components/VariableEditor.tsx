import type React from 'react';
import { use, useState } from 'react';
import AutosizeTextarea from 'react-textarea-autosize';
import { JsonViewContext } from '../context/JsonViewContext';
import type { ParsedInput } from '../helpers/parseInput';
import parseInput from '../helpers/parseInput';
import stringifyVariable from '../helpers/stringifyVariable';
import Theme from '../themes/getStyle';
import type { OnCopyProps, OnSelectProps, ThemeKeys, ThemeObject } from '../types';
import CopyToClipboard from './CopyToClipboard';
import {
    JsonBoolean,
    JsonDate,
    JsonFloat,
    JsonFunction,
    JsonInteger,
    JsonNan,
    JsonNull,
    JsonRegexp,
    JsonString,
    JsonUndefined
} from './DataTypes/DataTypes';
import { CheckCircle, Edit, RemoveCircle as Remove } from './icons';

export interface JsonVariable {
    name: string | number;
    value: any;
    type: string;
}

export interface VariableEditorProps {
    variable: JsonVariable;
    singleIndent: number;
    type?: string | undefined;
    theme?: ThemeKeys | ThemeObject | undefined;
    namespace: Array<string | number | null>;
    indentWidth?: number | undefined;
    enableClipboard?: boolean | ((copy: OnCopyProps) => void) | undefined;
    onEdit?: ((edit: any) => false | unknown) | false | undefined;
    onDelete?: ((del: any) => false | unknown) | false | undefined;
    onSelect?: ((select: OnSelectProps) => void) | false | undefined;
    displayArrayKey?: boolean | undefined;
    quotesOnKeys?: boolean | undefined;
    rjvId?: string | undefined;
    collapseStringsAfterLength?: number | false | undefined;
    displayDataTypes?: boolean | undefined;
}

export const VariableEditor: React.FC<VariableEditorProps> = props => {
    const { dispatch, theme: contextTheme } = use(JsonViewContext);
    const {
        variable,
        singleIndent,
        type,
        theme = contextTheme || 'rjv-default',
        namespace,
        indentWidth = 4,
        enableClipboard = true,
        onEdit = false,
        onDelete = false,
        onSelect = false,
        displayArrayKey = true,
        quotesOnKeys = true
    } = props;

    const [editMode, setEditMode] = useState<boolean>(false);
    const [editValue, setEditValue] = useState<string>('');
    const [hovered, setHovered] = useState<boolean>(false);
    const [parsedInput, setParsedInput] = useState<ParsedInput>({
        type: false,
        value: null
    });

    const prepopInput = (v: JsonVariable) => {
        if (onEdit !== false) {
            const stringifiedValue = stringifyVariable(v.value);
            const detected = parseInput(stringifiedValue);
            setEditMode(true);
            setEditValue(stringifiedValue);
            setParsedInput({
                type: detected.type,
                value: detected.value
            });
        }
    };

    const submitEdit = (submit_detected = false) => {
        let new_value: any = editValue;
        if (submit_detected && parsedInput.type) {
            new_value = parsedInput.value;
        }
        setEditMode(false);
        dispatch({
            type: 'VARIABLE_UPDATED',
            payload: {
                name: variable.name,
                namespace: namespace,
                existing_value: variable.value,
                new_value: new_value,
                variable_removed: false
            }
        });
    };

    const getEditIcon = () => {
        return (
            <div
                className="click-to-edit"
                style={{
                    verticalAlign: 'top',
                    display: hovered ? 'inline-block' : 'none'
                }}
            >
                <Edit
                    className="click-to-edit-icon"
                    {...Theme(theme, 'editVarIcon')}
                    onClick={() => {
                        prepopInput(variable);
                    }}
                />
            </div>
        );
    };

    const getRemoveIcon = () => {
        return (
            <div
                className="click-to-remove"
                style={{
                    verticalAlign: 'top',
                    display: hovered ? 'inline-block' : 'none'
                }}
            >
                <Remove
                    className="click-to-remove-icon"
                    {...Theme(theme, 'removeVarIcon')}
                    onClick={() => {
                        dispatch({
                            type: 'VARIABLE_REMOVED',
                            payload: {
                                name: variable.name,
                                namespace: namespace,
                                existing_value: variable.value,
                                variable_removed: true
                            }
                        });
                    }}
                />
            </div>
        );
    };

    const getDetectedInput = () => {
        const { type: detectedType, value } = parsedInput;

        if (detectedType !== false) {
            switch (detectedType.toLowerCase()) {
                case 'object':
                    return (
                        <span>
                            <span
                                style={{
                                    ...Theme(theme, 'brace').style,
                                    cursor: 'default'
                                }}
                            >
                                {'{'}
                            </span>
                            <span
                                style={{
                                    ...Theme(theme, 'ellipsis').style,
                                    cursor: 'default'
                                }}
                            >
                                ...
                            </span>
                            <span
                                style={{
                                    ...Theme(theme, 'brace').style,
                                    cursor: 'default'
                                }}
                            >
                                {'}'}
                            </span>
                        </span>
                    );
                case 'array':
                    return (
                        <span>
                            <span
                                style={{
                                    ...Theme(theme, 'brace').style,
                                    cursor: 'default'
                                }}
                            >
                                {'['}
                            </span>
                            <span
                                style={{
                                    ...Theme(theme, 'ellipsis').style,
                                    cursor: 'default'
                                }}
                            >
                                ...
                            </span>
                            <span
                                style={{
                                    ...Theme(theme, 'brace').style,
                                    cursor: 'default'
                                }}
                            >
                                {']'}
                            </span>
                        </span>
                    );
                case 'string':
                    return <JsonString value={value as string} {...props} />;
                case 'integer':
                    return <JsonInteger value={value as number} {...props} />;
                case 'float':
                    return <JsonFloat value={value as number} {...props} />;
                case 'boolean':
                    return <JsonBoolean value={value as boolean} {...props} />;
                case 'function':
                    return (
                        <JsonFunction value={value as (...args: unknown[]) => unknown} {...props} />
                    );
                case 'null':
                    return <JsonNull {...props} />;
                case 'nan':
                    return <JsonNan {...props} />;
                case 'undefined':
                    return <JsonUndefined {...props} />;
                case 'date':
                    return <JsonDate value={new Date(value as string | number)} {...props} />;
            }
        }
        return null;
    };

    const showDetected = () => {
        const detected = getDetectedInput();
        if (detected) {
            return (
                <div>
                    <div {...Theme(theme, 'detected-row')}>
                        {detected}
                        <CheckCircle
                            className="edit-check detected"
                            style={{
                                verticalAlign: 'top',
                                paddingLeft: '3px',
                                ...Theme(theme, 'check-icon').style
                            }}
                            onClick={() => {
                                submitEdit(true);
                            }}
                        />
                    </div>
                </div>
            );
        }
        return null;
    };

    const getEditInput = () => {
        return (
            <div>
                <AutosizeTextarea
                    ref={input => {
                        if (input) {
                            input.focus();
                        }
                    }}
                    value={editValue}
                    className="variable-editor"
                    onChange={event => {
                        const val = event.target.value;
                        const detected = parseInput(val);
                        setEditValue(val);
                        setParsedInput({
                            type: detected.type,
                            value: detected.value
                        });
                    }}
                    onKeyDown={e => {
                        switch (e.key) {
                            case 'Escape': {
                                setEditMode(false);
                                setEditValue('');
                                break;
                            }
                            case 'Enter': {
                                if (e.ctrlKey || e.metaKey) {
                                    submitEdit(true);
                                }
                                break;
                            }
                        }
                        e.stopPropagation();
                    }}
                    placeholder="update this value"
                    minRows={2}
                    style={Theme(theme, 'edit-input').style as any}
                />
                <div {...Theme(theme, 'edit-icon-container')}>
                    <Remove
                        className="edit-cancel"
                        {...Theme(theme, 'cancel-icon')}
                        onClick={() => {
                            setEditMode(false);
                            setEditValue('');
                        }}
                    />
                    <CheckCircle
                        className="edit-check string-value"
                        {...Theme(theme, 'check-icon')}
                        onClick={() => {
                            submitEdit();
                        }}
                    />
                    <div>{showDetected()}</div>
                </div>
            </div>
        );
    };

    const getValue = (v: JsonVariable, isEdit: boolean) => {
        const vType = isEdit ? false : v.type;
        switch (vType) {
            case false:
                return getEditInput();
            case 'string':
                return <JsonString value={v.value} {...props} />;
            case 'integer':
                return <JsonInteger value={v.value} {...props} />;
            case 'float':
                return <JsonFloat value={v.value} {...props} />;
            case 'boolean':
                return <JsonBoolean value={v.value} {...props} />;
            case 'function':
                return <JsonFunction value={v.value} {...props} />;
            case 'null':
                return <JsonNull {...props} />;
            case 'nan':
                return <JsonNan {...props} />;
            case 'undefined':
                return <JsonUndefined {...props} />;
            case 'date':
                return <JsonDate value={v.value} {...props} />;
            case 'regexp':
                return <JsonRegexp value={v.value} {...props} />;
            default:
                // catch-all for types that weren't anticipated
                return <div className="object-value">{JSON.stringify(v.value)}</div>;
        }
    };

    return (
        <div
            {...Theme(theme, 'objectKeyVal', {
                paddingLeft: indentWidth * singleIndent
            })}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="variable-row"
            key={String(variable.name)}
        >
            {type === 'array' ? (
                displayArrayKey ? (
                    <span
                        {...Theme(theme, 'array-key')}
                        key={`${variable.name}_${namespace.join('.')}`}
                    >
                        {variable.name}
                        <div {...Theme(theme, 'colon')}>:</div>
                    </span>
                ) : null
            ) : (
                <span>
                    <span
                        {...Theme(theme, 'object-name')}
                        className="object-key"
                        key={`${variable.name}_${namespace.join('.')}`}
                    >
                        {!!quotesOnKeys && <span style={{ verticalAlign: 'top' }}>"</span>}
                        <span style={{ display: 'inline-block' }}>{variable.name}</span>
                        {!!quotesOnKeys && <span style={{ verticalAlign: 'top' }}>"</span>}
                    </span>
                    <span {...Theme(theme, 'colon')}>:</span>
                </span>
            )}
            <div
                className="variable-value"
                onClick={
                    onSelect === false && onEdit === false
                        ? undefined
                        : e => {
                              const location = [...namespace];
                              if ((e.ctrlKey || e.metaKey) && onEdit !== false) {
                                  prepopInput(variable);
                              } else if (onSelect !== false) {
                                  location.shift();
                                  onSelect({
                                      name: String(variable.name),
                                      value: variable.value,
                                      type: variable.type,
                                      namespace: location
                                  });
                              }
                          }
                }
                {...Theme(theme, 'variableValue', {
                    cursor: onSelect === false ? 'default' : 'pointer'
                })}
            >
                {getValue(variable, editMode)}
            </div>
            {enableClipboard ? (
                <CopyToClipboard
                    rowHovered={hovered}
                    hidden={editMode}
                    src={variable.value}
                    clickCallback={enableClipboard}
                    theme={theme}
                    namespace={[...namespace, variable.name]}
                />
            ) : null}
            {onEdit !== false && !editMode ? getEditIcon() : null}
            {onDelete !== false && !editMode ? getRemoveIcon() : null}
        </div>
    );
};

export default VariableEditor;
