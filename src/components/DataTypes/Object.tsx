import React, { useState, useEffect } from 'react';
import { toType } from '../../helpers/util';
import AttributeStore from '../../stores/ObjectAttributes';
import Theme from '../../themes/getStyle';
import type { CollapsedFieldProps, IconStyle, ThemeKeys, ThemeObject } from '../../types';
import ArrayGroup from '../ArrayGroup';
import ObjectName from '../ObjectName';
import { CollapsedIcon, ExpandedIcon } from '../ToggleIcons';
import VariableEditor, { type JsonVariable } from '../VariableEditor';
import VariableMeta from '../VariableMeta';

const DEPTH_INCREMENT = 1;
const SINGLE_INDENT = 5;

export interface RjvObjectProps {
    src: any;
    collapsed?: boolean | number | undefined;
    depth?: number | undefined;
    name?: string | number | null | false | undefined;
    namespace: Array<string | number | null>;
    type?: string | undefined;
    parent_type?: string | undefined;
    theme?: ThemeKeys | ThemeObject | undefined;
    jsvRoot?: boolean | undefined;
    iconStyle?: IconStyle | undefined;
    rjvId: string;
    indentWidth?: number | undefined;
    shouldCollapse?: false | ((field: CollapsedFieldProps) => boolean) | undefined;
    sortKeys?: boolean | undefined;
    groupArraysAfterLength?: number | undefined;
    index_offset?: number | undefined;
    [key: string]: any;
}

function calculateExpanded(props: RjvObjectProps): boolean {
    const size = Object.keys(props.src || {}).length;
    const depth = props.depth ?? 0;
    const defaultExpanded =
        (props.collapsed === false ||
            (props.collapsed !== true && typeof props.collapsed === 'number' && props.collapsed > depth)) &&
        (!props.shouldCollapse ||
            props.shouldCollapse({
                name: props.name ?? null,
                src: props.src,
                type: toType(props.src),
                namespace: props.namespace
            }) === false) &&
        size !== 0;

    return AttributeStore.get(
        props.rjvId,
        props.namespace.join('.'),
        'expanded',
        defaultExpanded
    );
}

export const RjvObject: React.FC<RjvObjectProps> = (props) => {
    const {
        depth = 0,
        src,
        namespace,
        name,
        type,
        parent_type,
        theme = 'rjv-default',
        jsvRoot = false,
        iconStyle = 'triangle',
        rjvId,
        indentWidth = 4,
        shouldCollapse = false,
        sortKeys = false,
        groupArraysAfterLength = 100,
        index_offset,
        ...rest
    } = props;

    const size = Object.keys(src || {}).length;
    const object_type = type === 'array' ? 'array' : 'object';

    const [expanded, setExpanded] = useState<boolean>(() => calculateExpanded(props));
    const [hovered, setHovered] = useState<boolean>(false);

    useEffect(() => {
        setExpanded(calculateExpanded(props));
    }, [src, props.collapsed, name, rjvId]);

    const toggleCollapsed = () => {
        const nextExpanded = !expanded;
        setExpanded(nextExpanded);
        AttributeStore.set(
            rjvId,
            namespace.join('.'),
            'expanded',
            nextExpanded
        );
    };

    const getEllipsis = () => {
        if (size === 0) {
            return null;
        }
        return (
            <div
                {...Theme(theme, 'ellipsis')}
                className="node-ellipsis"
                onClick={toggleCollapsed}
            >
                ...
            </div>
        );
    };

    const getObjectMetaData = () => {
        return (
            <VariableMeta
                rowHovered={hovered}
                size={size}
                src={src}
                theme={theme}
                namespace={namespace}
                name={name}
                rjvId={rjvId}
                depth={depth}
                {...rest}
            />
        );
    };

    const getBraceStart = () => {
        if (parent_type === 'array_group') {
            return (
                <span>
                    <span {...Theme(theme, 'brace')}>
                        {object_type === 'array' ? '[' : '{'}
                    </span>
                    {expanded ? getObjectMetaData() : null}
                </span>
            );
        }

        const IconComponent = expanded ? ExpandedIcon : CollapsedIcon;

        return (
            <span>
                <span
                    onClick={() => toggleCollapsed()}
                    {...Theme(theme, 'brace-row')}
                >
                    <div
                        className="icon-container"
                        {...Theme(theme, 'icon-container')}
                    >
                        <IconComponent theme={theme} iconStyle={iconStyle} />
                    </div>
                    <ObjectName
                        parent_type={parent_type}
                        namespace={namespace}
                        theme={theme}
                        jsvRoot={jsvRoot}
                        name={name}
                        {...rest}
                    />
                    <span {...Theme(theme, 'brace')}>
                        {object_type === 'array' ? '[' : '{'}
                    </span>
                </span>
                {expanded ? getObjectMetaData() : null}
            </span>
        );
    };

    const renderObjectContents = (variables: any) => {
        const elements: React.ReactElement[] = [];
        let keys = Object.keys(variables || {});
        if (sortKeys && object_type !== 'array') {
            keys = keys.sort();
        }

        keys.forEach(k => {
            const variable: JsonVariable = {
                name: k,
                value: variables[k],
                type: toType(variables[k])
            };

            if (parent_type === 'array_group' && index_offset !== undefined) {
                variable.name = parseInt(String(variable.name), 10) + index_offset;
            }

            if (!Object.prototype.hasOwnProperty.call(variables, k)) {
                return;
            } else if (variable.type === 'object') {
                elements.push(
                    <RjvObject
                        key={String(variable.name)}
                        depth={depth + DEPTH_INCREMENT}
                        name={variable.name}
                        src={variable.value}
                        namespace={namespace.concat(variable.name)}
                        parent_type={object_type}
                        theme={theme}
                        iconStyle={iconStyle}
                        rjvId={rjvId}
                        indentWidth={indentWidth}
                        shouldCollapse={shouldCollapse}
                        sortKeys={sortKeys}
                        groupArraysAfterLength={groupArraysAfterLength}
                        {...rest}
                    />
                );
            } else if (variable.type === 'array') {
                if (
                    groupArraysAfterLength &&
                    Array.isArray(variable.value) &&
                    variable.value.length > groupArraysAfterLength
                ) {
                    elements.push(
                        <ArrayGroup
                            key={String(variable.name)}
                            depth={depth + DEPTH_INCREMENT}
                            name={variable.name}
                            src={variable.value}
                            namespace={namespace.concat(variable.name)}
                            parent_type={object_type}
                            theme={theme}
                            iconStyle={iconStyle}
                            rjvId={rjvId}
                            indentWidth={indentWidth}
                            groupArraysAfterLength={groupArraysAfterLength}
                            {...rest}
                        />
                    );
                } else {
                    elements.push(
                        <RjvObject
                            key={String(variable.name)}
                            depth={depth + DEPTH_INCREMENT}
                            name={variable.name}
                            src={variable.value}
                            namespace={namespace.concat(variable.name)}
                            type="array"
                            parent_type={object_type}
                            theme={theme}
                            iconStyle={iconStyle}
                            rjvId={rjvId}
                            indentWidth={indentWidth}
                            shouldCollapse={shouldCollapse}
                            sortKeys={sortKeys}
                            groupArraysAfterLength={groupArraysAfterLength}
                            {...rest}
                        />
                    );
                }
            } else {
                elements.push(
                    <VariableEditor
                        key={variable.name + '_' + namespace.join('.')}
                        variable={variable}
                        singleIndent={SINGLE_INDENT}
                        namespace={namespace}
                        type={type}
                        theme={theme}
                        rjvId={rjvId}
                        indentWidth={indentWidth}
                        {...rest}
                    />
                );
            }
        });

        return elements;
    };

    const getObjectContent = () => {
        return (
            <div className="pushed-content object-container">
                <div
                    className="object-content"
                    {...Theme(theme, 'pushed-content')}
                >
                    {renderObjectContents(src)}
                </div>
            </div>
        );
    };

    const styles: React.CSSProperties = {};
    if (!jsvRoot && parent_type !== 'array_group') {
        styles.paddingLeft = indentWidth * SINGLE_INDENT;
    } else if (parent_type === 'array_group') {
        styles.borderLeft = 0;
        styles.display = 'inline';
    }

    return (
        <div
            className="object-key-val"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            {...Theme(theme, jsvRoot ? 'jsv-root' : 'objectKeyVal', styles)}
        >
            {getBraceStart()}
            {expanded ? getObjectContent() : getEllipsis()}
            <span className="brace-row">
                <span
                    style={{
                        ...Theme(theme, 'brace').style,
                        paddingLeft: expanded ? '3px' : '0px'
                    }}
                >
                    {object_type === 'array' ? ']' : '}'}
                </span>
                {expanded ? null : getObjectMetaData()}
            </span>
        </div>
    );
};

export default RjvObject;
