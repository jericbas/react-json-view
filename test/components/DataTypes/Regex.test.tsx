import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import JsonRegex from '../../../src/components/DataTypes/Regexp';

describe('<JsonRegex />', () => {
    it('regex component should have a data type label', () => {
        const { container } = render(
            <JsonRegex
                value={/[0-9]/gi}
                displayDataTypes={true}
                theme="rjv-default"
            />
        );
        expect(container.querySelectorAll('.data-type-label')).toHaveLength(1);
    });

    it('regex component should not have a data type label', () => {
        const { container } = render(
            <JsonRegex
                value={/[0-9]/gi}
                displayDataTypes={false}
                theme="rjv-default"
            />
        );
        expect(container.querySelectorAll('.data-type-label')).toHaveLength(0);
    });
});
