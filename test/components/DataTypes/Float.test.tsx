import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import JsonFloat from '../../../src/components/DataTypes/Float';

describe('<JsonFloat />', () => {
    it('float component should have a data type label', () => {
        const { container } = render(
            <JsonFloat
                value={1.25}
                displayDataTypes={true}
                theme="rjv-default"
            />
        );
        expect(container.querySelectorAll('.data-type-label')).toHaveLength(1);
    });

    it('float component should not have a data type label', () => {
        const { container } = render(
            <JsonFloat
                value={1.25}
                displayDataTypes={false}
                theme="rjv-default"
            />
        );
        expect(container.querySelectorAll('.data-type-label')).toHaveLength(0);
    });
});
