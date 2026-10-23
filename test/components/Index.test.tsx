import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Index from '../../src/index';

describe('<Index />', () => {
    it('check data type labels from index', () => {
        const { container } = render(
            <Index
                src={{
                    bool: true,
                    str: 'test',
                    int: 5,
                    nan: NaN,
                    null: null,
                    func: () => {},
                    obj: {
                        arrChild: [1, 2, 'three'],
                        objChild: {
                            one: 1,
                            two: 'two'
                        }
                    },
                    arr: [[1, 'two'], { one: 'one', two: 2 }],
                    regexp: /[0-9]/gi
                }}
            />
        );
        expect(container.querySelectorAll('.data-type-label')).toHaveLength(14);
    });

    it('check object-size labels from index and toggling', () => {
        const testSrc = {
            bool: true,
            str: 'test',
            int: 5,
            nan: NaN,
            null: null,
            func: () => {},
            obj: {
                arrChild: [1, 2, 'three'],
                objChild: {
                    one: 1,
                    two: 'two'
                }
            },
            arr: [[1, 'two'], { one: 'one', two: 2 }],
            regexp: /[0-9]/gi
        };

        const { container, rerender } = render(
            <Index
                src={testSrc}
                displayObjectSize={true}
                displayDataTypes={true}
                enableClipboard={false}
            />
        );
        expect(container.querySelectorAll('.object-size')).toHaveLength(7);

        rerender(
            <Index
                src={testSrc}
                displayObjectSize={false}
                displayDataTypes={true}
                enableClipboard={false}
            />
        );
        expect(container.querySelectorAll('.object-size')).toHaveLength(0);
    });

    it('src replaced with error message on invalid input', () => {
        const { container } = render(
            <Index src={'{jsonEncodedString:true, createError:true}' as any} />
        );
        expect(container.querySelectorAll('.data-type-label')).toHaveLength(1);
    });

    it('make sure copy to clipboard is displayed for properties when hovered', () => {
        const { container } = render(
            <Index
                src={{
                    test: true,
                    passing: 'hopefully',
                    arr: [5],
                    obj: {},
                    regexp: /[0-9]/gi
                }}
            />
        );
        expect(container.querySelectorAll('.copy-to-clipboard-container')).toHaveLength(7);
    });

    it('updates displayed content when src prop changes', () => {
        const { container, rerender } = render(<Index src={{ test: true }} />);
        expect(container.querySelectorAll('.data-type-label')).toHaveLength(1);

        rerender(<Index src={{ test1: true, test2: false }} />);
        expect(container.querySelectorAll('.data-type-label')).toHaveLength(2);
    });

    it('index can have ArrayGroup root component', () => {
        const { container } = render(
            <Index name="test" groupArraysAfterLength={5} src={new Array(15).fill(0)} />
        );
        expect(container.querySelectorAll('.array-group')).toHaveLength(3);
    });

    it('length is correct even if an object has a length property', () => {
        const { container } = render(
            <Index
                src={{
                    first: 'first property',
                    second: 'second property',
                    length: 1000
                }}
            />
        );
        expect(container.querySelectorAll('.object-size')).toHaveLength(1);
    });
});
