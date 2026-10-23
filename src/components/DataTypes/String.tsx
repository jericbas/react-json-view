import React, { useState } from 'react';
import { toType } from '../../helpers/util';
import AttributeStore from '../../stores/ObjectAttributes';
import Theme from '../../themes/getStyle';
import type { ThemeKeys, ThemeObject } from '../../types';
import DataTypeLabel from './DataTypeLabel';

export interface StringProps {
    value: string;
    collapseStringsAfterLength?: number | false | undefined;
    theme?: ThemeKeys | ThemeObject | undefined;
    displayDataTypes?: boolean | undefined;
    rjvId: string;
    namespace: Array<string | number | null>;
}

export const JsonString: React.FC<StringProps> = (props) => {
    const {
        collapseStringsAfterLength = false,
        theme = 'rjv-default',
        rjvId,
        namespace
    } = props;
    let { value } = props;
    const type_name = 'string';
    const [collapsed, setCollapsed] = useState<boolean>(() =>
        AttributeStore.get(rjvId, namespace.join('.'), 'collapsed', true)
    );

    const toggleCollapsed = () => {
        const nextCollapsed = !collapsed;
        setCollapsed(nextCollapsed);
        AttributeStore.set(rjvId, namespace.join('.'), 'collapsed', nextCollapsed);
    };

    const collapsible = toType(collapseStringsAfterLength) === 'integer';
    const style: { style: React.CSSProperties } = { style: { cursor: 'default' } };

    if (
        collapsible &&
        typeof collapseStringsAfterLength === 'number' &&
        value.length > collapseStringsAfterLength
    ) {
        style.style.cursor = 'pointer';
        if (collapsed) {
            value = value.substring(0, collapseStringsAfterLength);
        }
    }

    return (
        <div {...Theme(theme, 'string')}>
            <DataTypeLabel type_name={type_name} {...props} />
            <span
                className="string-value"
                {...style}
                onClick={toggleCollapsed}
            >
                "{value}
                {collapsible &&
                typeof collapseStringsAfterLength === 'number' &&
                props.value.length > collapseStringsAfterLength &&
                collapsed && (
                    <span {...Theme(theme, 'ellipsis')}> ...</span>
                )}
                "
            </span>
        </div>
    );
};

export default JsonString;
