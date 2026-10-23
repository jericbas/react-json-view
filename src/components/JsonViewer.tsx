import type React from 'react';
import type { IconStyle, ThemeKeys, ThemeObject } from '../types';
import ArrayGroup from './ArrayGroup';
import JsonObject from './DataTypes/Object';

export interface JsonViewerProps {
    src: any;
    name?: string | number | null | false;
    theme?: ThemeKeys | ThemeObject;
    type?: string;
    rjvId: string;
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
    const namespace = [props.name ?? null];
    let ObjectComponent: React.ComponentType<any> = JsonObject;

    if (
        Array.isArray(props.src) &&
        props.groupArraysAfterLength &&
        props.src.length > props.groupArraysAfterLength
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
                />
            </div>
        </div>
    );
};

export default JsonViewer;
