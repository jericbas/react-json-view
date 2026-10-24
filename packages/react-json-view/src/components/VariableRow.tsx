import type React from 'react';
import { useState } from 'react';
import { useJsonView } from '../context/JsonViewContext';
import Theme from '../themes/getStyle';
import type { JsonVariable, OnSelectProps, ThemeKeys, ThemeObject } from '../types';
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
import { VariableKeyLabel } from './VariableEditor/VariableKeyLabel';

export interface VariableRowProps {
  variable: JsonVariable;
  singleIndent: number;
  type?: string | undefined;
  theme?: ThemeKeys | ThemeObject | undefined;
  namespace: Array<string | number | null>;
  indentWidth?: number | undefined;
  onSelect?: ((select: OnSelectProps) => void) | false | undefined;
  displayArrayKey?: boolean | undefined;
  quotesOnKeys?: boolean | undefined;
  rjvId?: string | undefined;
  collapseStringsAfterLength?: number | false | undefined;
  displayDataTypes?: boolean | undefined;
  depth?: number | undefined;
}

function renderDefaultDataType(
  variable: JsonVariable,
  theme: any,
  namespace: Array<string | number | null>,
  displayDataTypes?: boolean,
  collapseStringsAfterLength?: number | false,
  rjvId?: string
) {
  const commonProps = {
    displayDataTypes,
    rjvId
  };

  switch (variable.type) {
    case 'string':
      return (
        <JsonString
          value={variable.value}
          theme={theme}
          namespace={namespace}
          collapseStringsAfterLength={collapseStringsAfterLength}
          {...commonProps}
        />
      );
    case 'integer':
      return <JsonInteger value={variable.value} theme={theme} {...commonProps} />;
    case 'float':
      return <JsonFloat value={variable.value} theme={theme} {...commonProps} />;
    case 'boolean':
      return <JsonBoolean value={variable.value} theme={theme} {...commonProps} />;
    case 'function':
      return (
        <JsonFunction value={variable.value} theme={theme} namespace={namespace} {...commonProps} />
      );
    case 'null':
      return <JsonNull theme={theme} {...commonProps} />;
    case 'nan':
      return <JsonNan theme={theme} {...commonProps} />;
    case 'undefined':
      return <JsonUndefined theme={theme} {...commonProps} />;
    case 'date':
      return <JsonDate value={variable.value} theme={theme} {...commonProps} />;
    case 'regexp':
      return <JsonRegexp value={variable.value} theme={theme} {...commonProps} />;
    default:
      return <div className="object-value">{JSON.stringify(variable.value)}</div>;
  }
}

export const VariableRow: React.FC<VariableRowProps> = props => {
  const context = useJsonView();
  const {
    variable,
    singleIndent,
    type,
    theme = context.theme || 'rjv-default',
    namespace,
    indentWidth = 4,
    onSelect = false,
    displayArrayKey = true,
    quotesOnKeys = true,
    rjvId,
    collapseStringsAfterLength = false,
    displayDataTypes = true,
    depth = 0
  } = props;

  const [hovered, setHovered] = useState<boolean>(false);
  const plugins = context.plugins || [];

  const defaultRender = () =>
    renderDefaultDataType(
      variable,
      theme,
      namespace,
      displayDataTypes,
      collapseStringsAfterLength,
      rjvId
    );

  let renderedValue: React.ReactNode;
  for (const plugin of plugins) {
    if (plugin.renderValue) {
      const intercepted = plugin.renderValue({
        variable,
        namespace,
        theme,
        depth,
        displayDataTypes,
        collapseStringsAfterLength,
        defaultRender
      });
      if (intercepted !== undefined) {
        renderedValue = intercepted;
        break;
      }
    }
  }

  if (renderedValue === undefined) {
    renderedValue = defaultRender();
  }

  const handleSelect =
    onSelect === false
      ? undefined
      : () => {
          const location = [...namespace];
          location.shift();
          onSelect({
            name: String(variable.name),
            value: variable.value,
            type: variable.type,
            namespace: location
          });
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
      <VariableKeyLabel
        type={type}
        displayArrayKey={displayArrayKey}
        theme={theme}
        variable={variable}
        namespace={namespace}
        quotesOnKeys={quotesOnKeys}
      />
      <div
        className="variable-value"
        onClick={handleSelect}
        {...Theme(theme, 'variableValue', {
          cursor: onSelect === false ? 'default' : 'pointer'
        })}
      >
        {renderedValue}
      </div>
      {plugins.map((plugin, idx) => {
        const actionNode = plugin.renderRowActions?.({
          variable,
          namespace,
          theme,
          hovered,
          depth
        });
        return actionNode ? (
          <span key={plugin.name || `action-${idx}`} className="row-action-slot">
            {actionNode}
          </span>
        ) : null;
      })}
    </div>
  );
};

export default VariableRow;
