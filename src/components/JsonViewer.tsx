import React, { use } from 'react';
import { JsonViewContext } from '../context/JsonViewContext';
import type { IconStyle, ThemeKeys, ThemeObject } from '../types';
import ArrayGroup from './ArrayGroup';
import JsonObject from './DataTypes/Object';

export interface JsonViewerProps {
    src?: any;
    name?: string | number | null | false;
    theme?: ThemeKeys | ThemeObject;
    type?: string;
    rjvId?: string;
    groupArraysAfterLength?: number;
    indentWidth?: number;
    iconStyle?: IconStyle;
    collapsed?: boolean | number;
    collapseStringsAfterLength?: number | false;
    shouldCollapse?: false | ((field: any) => boolean);
    sortKeys?: boolean;
    quotesOnKeys?: boolean;
    enableClipboard?: boolean | ((copy: any) => void);
    displayObjectSize?: boolean;
    displayDataTypes?: boolean;
    onEdit?: ((edit: any) => false | unknown) | false;
    onDelete?: ((del: any) => false | unknown) | false;
    onAdd?: ((add: any) => false | unknown) | false;
    onSelect?: ((select: any) => void) | false;
    validationMessage?: string;
    defaultValue?: any;
    displayArrayKey?: boolean;
    [key: string]: any;
}

export const JsonViewer: React.FC<JsonViewerProps> = (props) => {
    const context = use(JsonViewContext);
    const src = props.src !== undefined ? props.src : context.src;
    const name = props.name !== undefined ? props.name : context.name;
    const theme = props.theme !== undefined ? props.theme : context.theme;

    const namespace = [name ?? null];
    let ObjectComponent: React.ComponentType<any> = JsonObject;

    if (
        Array.isArray(src) &&
        props.groupArraysAfterLength &&
        src.length > props.groupArraysAfterLength
    ) {
        ObjectComponent = ArrayGroup;
    }

    return (
        <div className="pretty-json-container object-container">
            <div className="object-content">
                <ObjectComponent
                    namespace={namespace}
                    depth={0}
                    jsvRoot={true}
                    {...props}
                    src={src}
                    name={name}
                    theme={theme}
                />
            </div>
        </div>
    );
};

export default JsonViewer;
