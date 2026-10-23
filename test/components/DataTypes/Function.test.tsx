import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import JsonFunction from '../../../src/components/DataTypes/Function';
import { JsonViewContext, defaultContextValue } from '../../../src/context/JsonViewContext';

describe('<JsonFunction />', () => {
    it('function component should have a data type label', () => {
        const { container } = render(
            <JsonFunction
                value={function () {}}
                namespace={['root']}
                displayDataTypes={true}
                theme="rjv-default"
            />
        );
        expect(container.querySelectorAll('.data-type-label')).toHaveLength(1);
    });

    it('function component should not have a data type label', () => {
        const { container } = render(
            <JsonFunction
                value={function () {}}
                namespace={['root']}
                displayDataTypes={false}
                theme="rjv-default"
            />
        );
        expect(container.querySelectorAll('.data-type-label')).toHaveLength(0);
    });

    it('function component expanded', () => {
        const { container } = render(
            <JsonViewContext.Provider
                value={{
                    ...defaultContextValue,
                    collapsed: { 'function-test': false }
                }}
            >
                <JsonFunction
                    value={function () {}}
                    namespace={['function-test']}
                    displayDataTypes={true}
                    theme="rjv-default"
                />
            </JsonViewContext.Provider>
        );
        expect(container.querySelectorAll('.function-collapsed')).toHaveLength(0);
    });

    it('function component collapsed', () => {
        const { container } = render(
            <JsonViewContext.Provider
                value={{
                    ...defaultContextValue,
                    collapsed: { 'function-test': true }
                }}
            >
                <JsonFunction
                    value={function () {}}
                    namespace={['function-test']}
                    displayDataTypes={true}
                    theme="rjv-default"
                />
            </JsonViewContext.Provider>
        );
        expect(container.querySelectorAll('.function-collapsed')).toHaveLength(1);
    });

    it('function component click to toggle collapsed', () => {
        const mockSetCollapsed = vi.fn();
        const { container } = render(
            <JsonViewContext.Provider
                value={{
                    ...defaultContextValue,
                    collapsed: { 'function-test': true },
                    setCollapsed: mockSetCollapsed
                }}
            >
                <JsonFunction
                    value={function () {}}
                    namespace={['function-test']}
                    displayDataTypes={true}
                    theme="rjv-default"
                />
            </JsonViewContext.Provider>
        );

        expect(container.querySelectorAll('.function-collapsed')).toHaveLength(1);
        const toggleBtn = container.querySelector('.rjv-function-container');
        expect(toggleBtn).not.toBeNull();
        if (toggleBtn) {
            fireEvent.click(toggleBtn);
        }
        expect(mockSetCollapsed).toHaveBeenCalledWith('function-test', false);
    });
});
