import { describe, it, expect } from 'vitest';
import getStyle from '../../src/themes/getStyle';

describe('getStyle', () => {
    it('test that style is returned', () => {
        const style = getStyle('rjv-default', 'app-container');
        expect(style.style.cursor).toBe('default');
    });

    it('test objectKeyVal return', () => {
        const style = getStyle('rjv-default', 'objectKeyVal', { paddingLeft: 10 });
        expect(style.style).toBeDefined();
    });

    it('test "none" theme', () => {
        const style = getStyle('none', 'app-container');
        expect(style.style).toBeDefined();
    });

    it('test theme not set (NOTICE OUTPUT EXPECTED)', () => {
        const style = getStyle(false, 'app-container');
        expect(style.style).toBeDefined();
    });
});
