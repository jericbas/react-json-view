import React, { useState } from 'react';
import AttributeStore from '../../stores/ObjectAttributes';
import Theme from '../../themes/getStyle';
import type { ThemeKeys, ThemeObject } from '../../types';
import DataTypeLabel from './DataTypeLabel';

export interface FunctionProps {
    value: (...args: unknown[]) => unknown;
    theme?: ThemeKeys | ThemeObject | undefined;
    displayDataTypes?: boolean | undefined;
    rjvId: string;
    namespace: Array<string | number | null>;
}

export const JsonFunction: React.FC<FunctionProps> = (props) => {
    const { value, theme = 'rjv-default', rjvId, namespace } = props;
    const type_name = 'function';
    const [collapsed, setCollapsed] = useState<boolean>(() =>
        AttributeStore.get(rjvId, namespace.join('.'), 'collapsed', true)
    );

    const toggleCollapsed = () => {
        const nextCollapsed = !collapsed;
        setCollapsed(nextCollapsed);
        AttributeStore.set(rjvId, namespace.join('.'), 'collapsed', nextCollapsed);
    };

    const getFunctionDisplay = () => {
        const fnStr = value.toString();
        if (collapsed) {
            return (
                <span>
                    {fnStr.slice(9, -1).replace(/\{[\s\S]+/, '')}
                    <span
                        className="function-collapsed"
                        style={{ fontWeight: 'bold' }}
                    >
                        <span>{'{'}</span>
                        <span {...Theme(theme, 'ellipsis')}>...</span>
                        <span>{'}'}</span>
                    </span>
                </span>
            );
        } else {
            return fnStr.slice(9, -1);
        }
    };

    return (
        <div {...Theme(theme, 'function')}>
            <DataTypeLabel type_name={type_name} {...props} />
            <span
                {...Theme(theme, 'function-value')}
                className="rjv-function-container"
                onClick={toggleCollapsed}
            >
                {getFunctionDisplay()}
            </span>
        </div>
    );
};

export default JsonFunction;
