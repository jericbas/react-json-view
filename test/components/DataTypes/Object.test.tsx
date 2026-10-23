import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import JsonObject from '../../../src/components/DataTypes/Object';

describe('<JsonObject />', () => {
    it('Object component should have a data type label', () => {
        const src = { test: true };
        const { container } = render(
            <JsonObject
                src={src}
                namespace={['root']}
                theme="rjv-default"
                indentWidth={1}
                depth={1}
                collapsed={false}
                displayDataTypes={true}
                type="object"
            />
        );
        expect(container.querySelectorAll('.object-key-val')).toHaveLength(1);
    });

    it('Object mount, multiple data type labels', () => {
        const src = {
            bool: true,
            int: 5,
            str: 'test',
            nan: NaN,
            null: null,
            undefined: undefined,
            func: () => {},
            float: 1.325,
            arr: [1, 2],
            obj: { test: true },
            empty_arr: [],
            empty_obj: {}
        };
        const { container } = render(
            <JsonObject
                src={src}
                namespace={['root']}
                theme="rjv-default"
                indentWidth={1}
                depth={1}
                collapsed={false}
                displayDataTypes={true}
                type="object"
            />
        );
        expect(container.querySelectorAll('.data-type-label')).toHaveLength(8);
    });

    it('Object mount, no data type labels when collapsed', () => {
        const src = {
            bool: true,
            int: 5,
            str: 'test',
            nan: NaN,
            null: null,
            undefined: undefined,
            func: () => {},
            float: 1.325,
            arr: [1, 2],
            obj: { test: true }
        };
        const { container } = render(
            <JsonObject
                src={src}
                namespace={['root']}
                theme="rjv-default"
                indentWidth={1}
                depth={1}
                displayDataTypes={true}
                collapsed={true}
                type="object"
            />
        );
        expect(container.querySelectorAll('.data-type-label')).toHaveLength(0);
    });

    it('Array mount expanded', () => {
        const src = {
            arr1: ['test']
        };
        const { container } = render(
            <JsonObject
                src={src}
                namespace={['arr_test']}
                name="test"
                theme="rjv-default"
                indentWidth={1}
                collapsed={false}
                depth={1}
                displayDataTypes={true}
                type="array"
            />
        );
        expect(container.querySelectorAll('.expanded-icon')).toHaveLength(2);
        expect(container.querySelectorAll('.collapsed-icon')).toHaveLength(0);
    });

    it('Array mount collapsed', () => {
        const src = {
            arr1: [{ arr2: ['test'] }]
        };
        const { container } = render(
            <JsonObject
                src={src}
                namespace={['arr_test']}
                name="test"
                theme="rjv-default"
                collapsed={true}
                indentWidth={1}
                depth={1}
                type="array"
            />
        );
        expect(container.querySelectorAll('.expanded-icon')).toHaveLength(0);
        expect(container.querySelectorAll('.collapsed-icon')).toHaveLength(1);
    });

    it('Array mount collapsed circle', () => {
        const src = {
            arr1: [{ arr2: ['test'] }]
        };
        const { container } = render(
            <JsonObject
                src={src}
                namespace={['arr_test']}
                name="test"
                theme="rjv-default"
                collapsed={true}
                indentWidth={1}
                depth={1}
                type="array"
            />
        );
        expect(container.querySelectorAll('.expanded-icon')).toHaveLength(0);
        expect(container.querySelectorAll('.collapsed-icon')).toHaveLength(1);
    });

    it('Array mount collapsed square', () => {
        const src = {
            arr1: [{ arr2: ['test'] }]
        };
        const { container } = render(
            <JsonObject
                src={src}
                namespace={['arr_test']}
                name="test"
                theme="rjv-default"
                collapsed={true}
                indentWidth={1}
                depth={1}
                iconStyle="square"
                type="array"
            />
        );
        expect(container.querySelectorAll('.expanded-icon')).toHaveLength(0);
        expect(container.querySelectorAll('.collapsed-icon')).toHaveLength(1);
    });

    it('Array mount collapsed triangle', () => {
        const src = {
            arr1: [{ arr2: ['test'] }]
        };
        const { container } = render(
            <JsonObject
                src={src}
                namespace={['arr_test']}
                name="test"
                theme="rjv-default"
                collapsed={true}
                indentWidth={1}
                depth={1}
                iconStyle="triangle"
                type="array"
            />
        );
        expect(container.querySelectorAll('.expanded-icon')).toHaveLength(0);
        expect(container.querySelectorAll('.collapsed-icon')).toHaveLength(1);
    });

    it('non-empty object should have expanded icon when collapsed=false', () => {
        const src = { test: true };
        const { container } = render(
            <JsonObject src={src} theme="rjv-default" namespace={['root']} collapsed={false} />
        );
        expect(container.querySelectorAll('.expanded-icon')).toHaveLength(1);
    });

    it('empty object should not be expanded', () => {
        const src = {};
        const { container } = render(
            <JsonObject src={src} theme="rjv-default" namespace={['root']} collapsed={false} />
        );
        expect(container.querySelectorAll('.expanded-icon')).toHaveLength(0);
    });

    it('non-empty array should have expanded icon when collapsed=false', () => {
        const src = [1, 2, 3];
        const { container } = render(
            <JsonObject src={src} theme="rjv-default" namespace={['root']} collapsed={false} />
        );
        expect(container.querySelectorAll('.expanded-icon')).toHaveLength(1);
    });

    it('empty array should not be expanded', () => {
        const src: any[] = [];
        const { container } = render(
            <JsonObject
                src={src}
                theme="rjv-default"
                namespace={['root']}
                collapsed={false}
                indentWidth={1}
            />
        );
        expect(container.querySelectorAll('.expanded-icon')).toHaveLength(0);
    });

    it('non-empty array should have ellipsis when collapsed', () => {
        const src = [1, 2, 3];
        const { container } = render(
            <JsonObject
                src={src}
                theme="rjv-default"
                namespace={['root']}
                collapsed={true}
                indentWidth={1}
            />
        );
        expect(container.querySelectorAll('.node-ellipsis')).toHaveLength(1);
    });

    it('empty array should not have ellipsis when collapsed', () => {
        const src: any[] = [];
        const { container } = render(
            <JsonObject
                src={src}
                theme="rjv-default"
                namespace={['root']}
                collapsed={true}
                indentWidth={1}
            />
        );
        expect(container.querySelectorAll('.node-ellipsis')).toHaveLength(0);
    });

    it('should collapse when shouldCollapse returns true', () => {
        const src = { prop1: 1, prop2: 2, prop3: 3 };
        const { container } = render(
            <JsonObject
                src={src}
                theme="rjv-default"
                namespace={['root']}
                collapsed={false}
                shouldCollapse={() => true}
            />
        );
        expect(container.querySelectorAll('.collapsed-icon')).toHaveLength(1);
    });

    it('should expand when shouldCollapse returns false', () => {
        const src = { prop1: 1, prop2: 2, prop3: 3 };
        const { container } = render(
            <JsonObject
                src={src}
                theme="rjv-default"
                namespace={['root']}
                collapsed={false}
                shouldCollapse={() => false}
                indentWidth={1}
            />
        );
        expect(container.querySelectorAll('.expanded-icon')).toHaveLength(1);
    });

    it('sort object keys', () => {
        const src = {
            d: 'd',
            b: 'b',
            a: 'a',
            c: 'c'
        };
        const { container } = render(
            <JsonObject
                src={src}
                theme="rjv-default"
                namespace={['root']}
                sortKeys={true}
                collapsed={false}
                shouldCollapse={() => false}
                quotesOnKeys={true}
                displayObjectSize={false}
                displayDataTypes={false}
                indentWidth={1}
            />
        );
        expect(container.textContent).toBe('"":{"a":"a""b":"b""c":"c""d":"d"}');
    });

    it('do not sort object keys', () => {
        const src = {
            d: 'd',
            b: 'b',
            a: 'a',
            c: 'c'
        };
        const { container } = render(
            <JsonObject
                src={src}
                theme="rjv-default"
                namespace={['root']}
                collapsed={false}
                shouldCollapse={() => false}
                quotesOnKeys={true}
                displayObjectSize={false}
                displayDataTypes={false}
                indentWidth={1}
            />
        );
        expect(container.textContent).toBe('"":{"d":"d""b":"b""a":"a""c":"c"}');
    });
});
