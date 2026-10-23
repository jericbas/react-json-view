import React from 'react';
import ReactJson from './../../../../src/index';

import Code from './../helpers/Code';
import './../../style/scss/rjv-demo.scss';

const Select = ({ name, value, options, onChange }) => (
    <select
        name={name}
        className="rjv-select"
        value={
            typeof value === 'boolean' || typeof value === 'number' ? String(value) : (value ?? '')
        }
        onChange={e => {
            const rawVal = e.target.value;
            const opt = options.find(o => String(o.value) === rawVal);
            const resolvedVal = opt ? opt.value : rawVal;
            onChange({ value: resolvedVal, label: opt ? opt.label : rawVal });
        }}
        style={{
            width: '100%',
            height: '36px',
            padding: '4px 8px',
            fontSize: '13px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            backgroundColor: '#fff',
            color: '#333'
        }}
    >
        {options.map(opt => (
            <option key={String(opt.value)} value={String(opt.value)}>
                {String(opt.label)}
            </option>
        ))}
    </select>
);

//index entrypoint component
class Demo extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            ...Demo.defaultProps,
            src: this.getExampleJson(),
            asyncPromise: this.createAsyncPromise()
        };
    }

    createAsyncPromise = () => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    status: 'success',
                    message: 'Async JSON fetched and unwrapped natively using React 19 use() hook!',
                    timestamp: new Date().toISOString(),
                    items: [
                        { id: 1, name: 'Item Alpha', active: true },
                        { id: 2, name: 'Item Beta', active: false }
                    ]
                });
            }, 1000);
        });
    };

    reloadAsyncPromise = () => {
        this.setState({ asyncPromise: this.createAsyncPromise() });
    };

    static defaultProps = {
        theme: 'monokai',
        src: null,
        collapsed: false,
        collapseStringsAfter: 15,
        onAdd: true,
        onEdit: true,
        onDelete: true,
        displayObjectSize: true,
        enableClipboard: true,
        indentWidth: 4,
        displayDataTypes: true,
        iconStyle: 'triangle'
    };

    render() {
        const {
            src,
            collapseStringsAfter,
            onAdd,
            onEdit,
            onDelete,
            displayObjectSize,
            enableClipboard,
            theme,
            iconStyle,
            collapsed,
            indentWidth,
            displayDataTypes
        } = this.state;
        const style = {
            padding: '10px',
            borderRadius: '3px',
            margin: '10px 0px'
        };

        return (
            <div className="rjv-demo">
                <div className="rjv-header">
                    <div className="header-1">react-json-view</div>
                    <div className="header-2">component demo</div>
                    <img
                        className="rjv-logo"
                        src="https://github.com/mac-s-g/react-json-view/blob/master/doc/rjv-icon-alt.png?raw=true"
                        onClick={() => {
                            window.open('https://github.com/mac-s-g/react-json-view', '_blank');
                        }}
                    />
                    <a
                        className="rjv-github-link"
                        href="https://github.com/mac-s-g/react-json-view"
                        target="_blank"
                        rel="noreferrer"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            marginLeft: '12px',
                            padding: '4px 10px',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#24292e',
                            backgroundColor: '#eff3f6',
                            border: '1px solid rgba(27,31,35,0.2)',
                            borderRadius: '3px',
                            textDecoration: 'none',
                            verticalAlign: 'middle'
                        }}
                    >
                        ★ Star
                    </a>
                </div>
                <ReactJson
                    name={false}
                    collapsed={collapsed}
                    style={style}
                    theme={theme}
                    src={src}
                    collapseStringsAfterLength={collapseStringsAfter}
                    onEdit={
                        onEdit
                            ? e => {
                                  console.log(e);
                                  this.setState({ src: e.updated_src });
                              }
                            : false
                    }
                    onDelete={
                        onDelete
                            ? e => {
                                  console.log(e);
                                  this.setState({ src: e.updated_src });
                              }
                            : false
                    }
                    onAdd={
                        onAdd
                            ? e => {
                                  console.log(e);
                                  this.setState({ src: e.updated_src });
                              }
                            : false
                    }
                    displayObjectSize={displayObjectSize}
                    enableClipboard={enableClipboard}
                    indentWidth={indentWidth}
                    displayDataTypes={displayDataTypes}
                    iconStyle={iconStyle}
                />

                <div className="rjv-settings">
                    <div className="rjv-input">
                        <div className="rjv-label">Theme:</div>
                        {this.getThemeInput(theme)}
                    </div>
                    <div className="rjv-input">
                        <div className="rjv-label">Icon Style:</div>
                        {this.getIconStyleInput(iconStyle)}
                    </div>
                    <div className="rjv-input">
                        <div className="rjv-label">Enable Edit:</div>
                        {this.getEditInput(onEdit)}
                    </div>
                    <div className="rjv-input">
                        <div className="rjv-label">Enable Add:</div>
                        {this.getAddInput(onAdd)}
                    </div>
                    <div className="rjv-input">
                        <div className="rjv-label">Enable Delete:</div>
                        {this.getDeleteInput(onDelete)}
                    </div>
                    <div className="rjv-input">
                        <div className="rjv-label">Enable Clipboard:</div>
                        {this.getEnableClipboardInput(enableClipboard)}
                    </div>
                </div>

                <div className="rjv-settings">
                    <div className="rjv-input">
                        <div className="rjv-label">Display Data Types:</div>
                        {this.getDataTypesInput(displayDataTypes)}
                    </div>
                    <div className="rjv-input">
                        <div className="rjv-label">Display Object Size:</div>
                        {this.getObjectSizeInput(displayObjectSize)}
                    </div>
                    <div className="rjv-input">
                        <div className="rjv-label">Indent Width:</div>
                        {this.getIndentWidthInput(indentWidth)}
                    </div>
                    <div className="rjv-input">
                        <div className="rjv-label">Collapsed:</div>
                        {this.getCollapsedInput(collapsed)}
                    </div>
                    <div className="rjv-input">
                        <div className="rjv-label">Collapse Strings After Length:</div>
                        {this.getCollapsedStringsInput(collapseStringsAfter)}
                    </div>
                </div>

                {this.getNotes(onEdit, onAdd)}

                <div
                    style={{
                        marginTop: '30px',
                        padding: '15px',
                        border: '1px solid #444',
                        borderRadius: '4px'
                    }}
                >
                    <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
                        React 19 Native Async Promise &amp; Suspense Demo
                    </div>
                    <div style={{ marginBottom: '10px', color: '#888' }}>
                        Pass a Promise directly to <code>src</code> and wrap with{' '}
                        <code>&lt;Suspense&gt;</code>. React 19's native <code>use()</code> hook
                        unwraps the Promise automatically!
                    </div>
                    <button
                        onClick={this.reloadAsyncPromise}
                        style={{
                            padding: '6px 12px',
                            cursor: 'pointer',
                            marginBottom: '10px'
                        }}
                    >
                        Reload Async Promise
                    </button>
                    <React.Suspense
                        fallback={
                            <div style={{ padding: '10px', color: '#ffb86c' }}>
                                ⏳ Loading async JSON with React 19 Suspense...
                            </div>
                        }
                    >
                        <ReactJson name="async_data" theme={theme} src={this.state.asyncPromise} />
                    </React.Suspense>
                </div>
            </div>
        );
    }

    getNotes = (on_edit_enabled, on_add_enabled) => {
        const notes = [];
        if (on_edit_enabled) {
            notes.push(
                <span>
                    To edit a value, try <Code>ctrl/cmd + click</Code> enter edit mode
                </span>
            );
            notes.push(
                <span>
                    When editing a value, try <Code>ctrl/cmd + Enter</Code> to submit changes
                </span>
            );
            notes.push(
                <span>
                    When editing a value, try <Code>Escape</Code> key to cancel
                </span>
            );
        }
        if (on_add_enabled) {
            notes.push(
                <span>
                    When adding a new key, try <Code>Enter</Code> to submit
                </span>
            );
            notes.push(
                <span>
                    When adding a new key, try <Code>Escape</Code> to cancel
                </span>
            );
        }

        if (notes.length === 0) {
            return null;
        }

        return (
            <div style={{ marginTop: '20px', fontStyle: 'italic' }}>
                Keyboard Shortcuts
                <ul>
                    {notes.map(note => {
                        return <li key={note}>{note}</li>;
                    })}
                </ul>
            </div>
        );
    };

    getIconStyleInput = iconStyle => {
        return (
            <Select
                name="icon-style"
                value={iconStyle}
                options={[
                    { value: 'circle', label: 'circle' },
                    { value: 'square', label: 'square' },
                    { value: 'triangle', label: 'triangle' }
                ]}
                onChange={val => {
                    this.set('iconStyle', val);
                }}
            />
        );
    };

    getEditInput = onEdit => {
        return (
            <Select
                name="enable-edit"
                value={onEdit}
                options={[
                    { value: true, label: 'true' },
                    { value: false, label: 'false' }
                ]}
                onChange={val => {
                    this.set('onEdit', val);
                }}
            />
        );
    };

    getAddInput = onAdd => {
        return (
            <Select
                name="enable-add"
                value={onAdd}
                options={[
                    { value: true, label: 'true' },
                    { value: false, label: 'false' }
                ]}
                onChange={val => {
                    this.set('onAdd', val);
                }}
            />
        );
    };

    getDeleteInput = onDelete => {
        return (
            <Select
                name="enable-delete"
                value={onDelete}
                options={[
                    { value: true, label: 'true' },
                    { value: false, label: 'false' }
                ]}
                onChange={val => {
                    this.set('onDelete', val);
                }}
            />
        );
    };

    getEnableClipboardInput = enableClipboard => {
        return (
            <Select
                name="enable-clipboard"
                value={enableClipboard}
                options={[
                    { value: true, label: 'true' },
                    { value: false, label: 'false' }
                ]}
                onChange={val => {
                    this.set('enableClipboard', val);
                }}
            />
        );
    };

    getObjectSizeInput = displayObjectSize => {
        return (
            <Select
                name="display-object-size"
                value={displayObjectSize}
                options={[
                    { value: true, label: 'true' },
                    { value: false, label: 'false' }
                ]}
                onChange={val => {
                    this.set('displayObjectSize', val);
                }}
            />
        );
    };

    getDataTypesInput = displayDataTypes => {
        return (
            <Select
                name="display-data-types"
                value={displayDataTypes}
                options={[
                    { value: true, label: 'true' },
                    { value: false, label: 'false' }
                ]}
                onChange={val => {
                    this.set('displayDataTypes', val);
                }}
            />
        );
    };

    getCollapsedStringsInput = collapseStringsAfter => {
        return (
            <Select
                name="collapse-strings"
                value={collapseStringsAfter}
                options={[
                    { value: false, label: 'false' },
                    { value: 5, label: 5 },
                    { value: 10, label: 10 },
                    { value: 15, label: 15 },
                    { value: 20, label: 20 }
                ]}
                onChange={val => {
                    this.set('collapseStringsAfter', val);
                }}
            />
        );
    };

    getCollapsedInput = collapsed => {
        return (
            <Select
                name="collapsed"
                value={collapsed}
                options={[
                    { value: true, label: 'true' },
                    { value: false, label: 'false' },
                    { value: 1, label: 1 },
                    { value: 2, label: 2 }
                ]}
                onChange={val => {
                    this.set('collapsed', val);
                }}
            />
        );
    };

    getIndentWidthInput = indentWidth => {
        return (
            <Select
                name="indent-width"
                value={indentWidth}
                options={[
                    { value: 0, label: 0 },
                    { value: 1, label: 1 },
                    { value: 2, label: 2 },
                    { value: 3, label: 3 },
                    { value: 4, label: 4 },
                    { value: 5, label: 5 },
                    { value: 6, label: 6 },
                    { value: 7, label: 7 },
                    { value: 8, label: 8 },
                    { value: 9, label: 9 },
                    { value: 10, label: 10 }
                ]}
                onChange={val => {
                    this.set('indentWidth', val);
                }}
            />
        );
    };

    getThemeInput = theme => {
        return (
            <Select
                name="theme-select"
                value={theme}
                options={[
                    { value: 'apathy', label: 'apathy' },
                    { value: 'apathy:inverted', label: 'apathy:inverted' },
                    { value: 'ashes', label: 'ashes' },
                    { value: 'bespin', label: 'bespin' },
                    { value: 'brewer', label: 'brewer' },
                    { value: 'bright:inverted', label: 'bright:inverted' },
                    { value: 'bright', label: 'bright' },
                    { value: 'chalk', label: 'chalk' },
                    { value: 'codeschool', label: 'codeschool' },
                    { value: 'colors', label: 'colors' },
                    { value: 'eighties', label: 'eighties' },
                    { value: 'embers', label: 'embers' },
                    { value: 'flat', label: 'flat' },
                    { value: 'google', label: 'google' },
                    { value: 'grayscale', label: 'grayscale' },
                    {
                        value: 'grayscale:inverted',
                        label: 'grayscale:inverted'
                    },
                    { value: 'greenscreen', label: 'greenscreen' },
                    { value: 'harmonic', label: 'harmonic' },
                    { value: 'hopscotch', label: 'hopscotch' },
                    { value: 'isotope', label: 'isotope' },
                    { value: 'marrakesh', label: 'marrakesh' },
                    { value: 'mocha', label: 'mocha' },
                    { value: 'monokai', label: 'monokai' },
                    { value: 'ocean', label: 'ocean' },
                    { value: 'paraiso', label: 'paraiso' },
                    { value: 'pop', label: 'pop' },
                    { value: 'railscasts', label: 'railscasts' },
                    { value: 'rjv-default', label: 'rjv-default' },
                    { value: 'shapeshifter', label: 'shapeshifter' },
                    {
                        value: 'shapeshifter:inverted',
                        label: 'shapeshifter:inverted'
                    },
                    { value: 'solarized', label: 'solarized' },
                    { value: 'summerfruit', label: 'summerfruit' },
                    {
                        value: 'summerfruit:inverted',
                        label: 'summerfruit:inverted'
                    },
                    { value: 'threezerotwofour', label: 'threezerotwofour' },
                    { value: 'tomorrow', label: 'tomorrow' },
                    { value: 'tube', label: 'tube' },
                    { value: 'twilight', label: 'twilight' }
                ]}
                onChange={val => {
                    this.set('theme', val);
                }}
            />
        );
    };

    set = (field, value) => {
        const state = {};
        state[field] = value.value;
        this.setState(state);
    };

    //just a function to get an example JSON object
    getExampleJson = () => {
        return {
            string: 'this is a test string',
            integer: 42,
            array: [1, 2, 3, 'test', NaN],
            float: Math.PI,
            undefined: undefined,
            object: {
                'first-child': true,
                'second-child': false,
                'last-child': null
            },
            string_number: '1234',
            date: new Date()
        };
    };
}

export default Demo;
