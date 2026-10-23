import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import CopyToClipboard from '../../src/components/CopyToClipboard';

describe('<CopyToClipboard />', () => {
    it('CopyToClipboard container should exist', () => {
        const { container } = render(
            <CopyToClipboard
                src={{ test: true }}
                theme="rjv-default"
                clickCallback={true}
                hidden={false}
                namespace={['root']}
            />
        );
        expect(container.querySelectorAll('.copy-to-clipboard-container')).toHaveLength(1);
    });

    it('CopyToClipboard container exists when hidden', () => {
        const { container } = render(
            <CopyToClipboard
                src={{ test: true }}
                theme="rjv-default"
                clickCallback={true}
                hidden={true}
                namespace={['root']}
            />
        );
        expect(container.querySelectorAll('.copy-to-clipboard-container')).toHaveLength(1);
    });
});
