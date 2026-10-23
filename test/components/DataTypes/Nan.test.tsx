import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import JsonNan from '../../../src/components/DataTypes/Nan';

describe('<JsonNan />', () => {
    it('Nan component should not have data type label (display types enabled)', () => {
        const { container } = render(
            <JsonNan
                displayDataTypes={true}
                theme="rjv-default"
            />
        );
        expect(container.querySelectorAll('.data-type-label')).toHaveLength(0);
    });

    it('Nan component should not have data type label (display types disabled)', () => {
        const { container } = render(
            <JsonNan
                displayDataTypes={false}
                theme="rjv-default"
            />
        );
        expect(container.querySelectorAll('.data-type-label')).toHaveLength(0);
    });
});
