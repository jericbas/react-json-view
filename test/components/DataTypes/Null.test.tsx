import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import JsonNull from '../../../src/components/DataTypes/Null';

describe('<JsonNull />', () => {
    it('Null component should have no data type label (type labels enabled)', () => {
        const { container } = render(
            <JsonNull
                displayDataTypes={true}
                theme="rjv-default"
            />
        );
        expect(container.querySelectorAll('.data-type-label')).toHaveLength(0);
    });

    it('Null component should have no data type label (type labels disabled)', () => {
        const { container } = render(
            <JsonNull
                displayDataTypes={false}
                theme="rjv-default"
            />
        );
        expect(container.querySelectorAll('.data-type-label')).toHaveLength(0);
    });
});
