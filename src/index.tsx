import type React from 'react';
import { use } from 'react';
import JsonViewer from './components/JsonViewer';
import AddKeyRequest from './components/ObjectKeyModal/AddKeyRequest';
import ValidationFailure from './components/ValidationFailure';
import type {
  JsonViewAction,
  JsonViewContextValue,
  JsonViewState
} from './context/JsonViewContext';
import { JsonViewContext, jsonViewReducer, useJsonView } from './context/JsonViewContext';
import { isPromise } from './helpers/validateProps';
import { useJsonViewContainer } from './hooks/useJsonViewContainer';
import Theme from './themes/getStyle';
import type { ReactJsonViewProps } from './types';

export * from './types';
export type { JsonViewAction, JsonViewContextValue, JsonViewState };
export { JsonViewContext, jsonViewReducer, useJsonView };

export const ReactJsonView: React.FC<ReactJsonViewProps> = props => {
  const {
    src: srcProp = {},
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
    defaultValue = null,
    displayArrayKey = true
  } = props;

  // React 19: unwrap Promise if src is thenable using native use() hook
  const resolvedSrc = isPromise(srcProp) ? use(srcProp) : srcProp;

  const { contextValue, theme } = useJsonViewContainer(props, resolvedSrc);

  return (
    <JsonViewContext.Provider value={contextValue}>
      <div className="react-json-view" style={{ ...Theme(theme, 'app-container').style, ...style }}>
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
