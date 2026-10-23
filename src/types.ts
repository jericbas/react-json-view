import type * as React from 'react';

export type IconStyle = 'circle' | 'triangle' | 'square';

export type TypeDefaultValue = string | number | boolean | object;

export interface ThemeObject {
    scheme?: string;
    author?: string;
    base00: string;
    base01: string;
    base02: string;
    base03: string;
    base04: string;
    base05: string;
    base06: string;
    base07: string;
    base08: string;
    base09: string;
    base0A: string;
    base0B: string;
    base0C: string;
    base0D: string;
    base0E: string;
    base0F: string;
    [key: string]: string | undefined;
}

export type ThemeKeys =
    | 'apathy'
    | 'apathy:inverted'
    | 'ashes'
    | 'bespin'
    | 'brewer'
    | 'bright:inverted'
    | 'bright'
    | 'chalk'
    | 'codeschool'
    | 'colors'
    | 'eighties'
    | 'embers'
    | 'flat'
    | 'google'
    | 'grayscale'
    | 'grayscale:inverted'
    | 'greenscreen'
    | 'harmonic'
    | 'hopscotch'
    | 'isotope'
    | 'marrakesh'
    | 'mocha'
    | 'monokai'
    | 'ocean'
    | 'paraiso'
    | 'pop'
    | 'railscasts'
    | 'rjv-default'
    | 'rjv-grey'
    | 'shapeshifter'
    | 'shapeshifter:inverted'
    | 'solarized'
    | 'summerfruit'
    | 'summerfruit:inverted'
    | 'threezerotwofour'
    | 'tomorrow'
    | 'tube'
    | 'twilight'
    | 'none';

export interface OnCopyProps {
    /**
     * The JSON tree source object
     */
    src: object | unknown[] | unknown;
    /**
     * List of keys.
     */
    namespace: Array<string | number | null>;
    /**
     * The last key in the namespace array.
     */
    name: string | number | null;
}

export interface CollapsedFieldProps {
    /**
     * The name of the entry.
     */
    name: string | number | null | false;
    /**
     * The corresponding JSON subtree.
     */
    src: object | unknown[] | unknown;
    /**
     * The type of src. Can only be "array" or "object".
     */
    type: 'array' | 'object' | string;
    /**
     * The scopes above the current entry.
     */
    namespace: Array<string | number | null>;
}

export interface InteractionProps {
    /**
     * The updated subtree of the JSON tree.
     */
    updated_src: object | unknown[] | unknown;
    /**
     * The existing subtree of the JSON tree.
     */
    existing_src: object | unknown[] | unknown;
    /**
     * The key of the entry that is interacted with.
     */
    name: string | number | null;
    /**
     * List of keys.
     */
    namespace: Array<string | number | null>;
    /**
     * The original value of the entry that is interacted with.
     */
    existing_value: unknown;
    /**
     * The updated value of the entry that is interacted with.
     */
    new_value?: unknown;
}

export interface OnSelectProps {
    /**
     * The name of the currently selected entry.
     */
    name: string | number | null;
    /**
     * The value of the currently selected entry.
     */
    value: unknown;
    /**
     * The type of the value. For "number" type, it will be replaced with the more
     * accurate types: "float", "integer", or "nan".
     */
    type: string;
    /**
     * List of keys representing the scopes above the selected entry.
     */
    namespace: Array<string | number | null>;
}

export interface ReactJsonViewProps {
    /**
     * This property contains your input JSON.
     *
     * Required.
     */
    src: object;
    /**
     * Contains the name of your root node. Use null or false for no name.
     *
     * Default: "root"
     */
    name?: string | null | false;
    /**
     * RJV supports base-16 themes. Check out the list of supported themes in the demo.
     * A custom "rjv-default" theme applies by default.
     *
     * Default: "rjv-default"
     */
    theme?: ThemeKeys | ThemeObject;
    /**
     * Style attributes for react-json-view container.
     * Explicit style attributes will override attributes provided by a theme.
     */
    style?: React.CSSProperties;
    /**
     * Style of expand/collapse icons. Accepted values are "circle", "triangle" or "square".
     *
     * Default: "triangle"
     */
    iconStyle?: IconStyle;
    /**
     * Set the indent-width for nested objects.
     *
     * Default: 4
     */
    indentWidth?: number;
    /**
     * When set to true, all nodes will be collapsed by default.
     * Use an integer value to collapse at a particular depth.
     *
     * Default: false
     */
    collapsed?: boolean | number;
    /**
     * When an integer value is assigned, strings will be cut off at that length.
     * Collapsed strings are followed by an ellipsis.
     * String content can be expanded and collapsed by clicking on the string value.
     *
     * Default: false
     */
    collapseStringsAfterLength?: number | false;
    /**
     * Callback function to provide control over what objects and arrays should be collapsed by default.
     * An object is passed to the callback containing name, src, type ("array" or "object") and namespace.
     *
     * Default: false
     */
    shouldCollapse?: false | ((field: CollapsedFieldProps) => boolean);
    /**
     * When an integer value is assigned, arrays will be displayed in groups by count of the value.
     * Groups are displayed with bracket notation and can be expanded and collapsed by clicking on the brackets.
     *
     * Default: 100
     */
    groupArraysAfterLength?: number;
    /**
     * When prop is not false, the user can copy objects and arrays to clipboard by clicking on the clipboard icon.
     * Copy callbacks are supported.
     *
     * Default: true
     */
    enableClipboard?: boolean | ((copy: OnCopyProps) => void);
    /**
     * When set to true, objects and arrays are labeled with size.
     *
     * Default: true
     */
    displayObjectSize?: boolean;
    /**
     * When set to true, data type labels prefix values.
     *
     * Default: true
     */
    displayDataTypes?: boolean;
    /**
     * set to false to remove quotes from keys (eg. "name": vs. name:)
     *
     * Default: true
     */
    quotesOnKeys?: boolean;
    /**
     * When a callback function is passed in, edit functionality is enabled.
     * The callback is invoked before edits are completed. Returning false
     * from onEdit will prevent the change from being made. see: onEdit docs.
     *
     * Default: false
     */
    onEdit?: ((edit: InteractionProps) => false | unknown) | false;
    /**
     * When a callback function is passed in, add functionality is enabled.
     * The callback is invoked before additions are completed.
     * Returning false from onAdd will prevent the change from being made. see: onAdd docs
     *
     * Default: false
     */
    onAdd?: ((add: InteractionProps) => false | unknown) | false;
    /**
     * When a callback function is passed in, delete functionality is enabled.
     * The callback is invoked before deletions are completed.
     * Returning false from onDelete will prevent the change from being made. see: onDelete docs
     *
     * Default: false
     */
    onDelete?: ((del: InteractionProps) => false | unknown) | false;
    /**
     * When a function is passed in, clicking a value triggers the onSelect method to be called.
     *
     * Default: false
     */
    onSelect?: ((select: OnSelectProps) => void) | false;
    /**
     * Custom message for validation failures to onEdit, onAdd, or onDelete callbacks.
     *
     * Default: "Validation Error"
     */
    validationMessage?: string;
    /**
     * Set to true to sort object keys.
     *
     * Default: false
     */
    sortKeys?: boolean;
    /**
     * Set to a value to be used as defaultValue when adding new key to json
     *
     * Default: null
     */
    defaultValue?: TypeDefaultValue | TypeDefaultValue[] | null;
    /**
     * When set to true, array keys (indices) are displayed.
     *
     * Default: true
     */
    displayArrayKey?: boolean;
}
