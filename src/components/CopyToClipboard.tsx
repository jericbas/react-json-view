import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { toType } from '../helpers/util';
import Theme from '../themes/getStyle';
import type { OnCopyProps, ThemeKeys, ThemeObject } from '../types';
import { Clippy } from './icons';

export interface CopyToClipboardProps {
    src: unknown;
    theme?: ThemeKeys | ThemeObject;
    hidden?: boolean;
    rowHovered?: boolean;
    namespace: Array<string | number | null>;
    clickCallback?: boolean | ((copy: OnCopyProps) => void);
}

export const CopyToClipboard: React.FC<CopyToClipboardProps> = ({
    src,
    theme = 'rjv-default',
    hidden = false,
    rowHovered = false,
    namespace,
    clickCallback
}) => {
    const [copied, setCopied] = useState<boolean>(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    const clipboardValue = (value: unknown): unknown => {
        const type = toType(value);
        switch (type) {
            case 'function':
            case 'regexp':
                return (value as { toString(): string }).toString();
            default:
                return value;
        }
    };

    const handleCopy = () => {
        const textToCopy = JSON.stringify(clipboardValue(src), null, '  ') ?? '';

        if (navigator?.clipboard?.writeText) {
            navigator.clipboard.writeText(textToCopy).catch(() => {
                copyFallback(textToCopy);
            });
        } else {
            copyFallback(textToCopy);
        }

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            setCopied(false);
        }, 5500);

        setCopied(true);

        if (typeof clickCallback === 'function') {
            clickCallback({
                src: src,
                namespace: namespace,
                name: namespace.length > 0 ? (namespace[namespace.length - 1] ?? null) : null
            });
        }
    };

    const copyFallback = (text: string) => {
        const container = document.createElement('textarea');
        container.value = text;
        document.body.appendChild(container);
        container.select();
        try {
            document.execCommand('copy');
        } catch {
            // no-op
        }
        document.body.removeChild(container);
    };

    const getClippyIcon = () => {
        if (copied) {
            return (
                <span>
                    <Clippy className="copy-icon" {...Theme(theme, 'copy-icon')} />
                    <span {...Theme(theme, 'copy-icon-copied')}>✔</span>
                </span>
            );
        }

        return <Clippy className="copy-icon" {...Theme(theme, 'copy-icon')} />;
    };

    const style = Theme(theme, 'copy-to-clipboard').style;
    const display = hidden ? 'none' : 'inline';

    return (
        <span
            className="copy-to-clipboard-container"
            title="Copy to clipboard"
            style={{
                verticalAlign: 'top',
                display: rowHovered ? 'inline-block' : 'none'
            }}
        >
            <span
                style={{
                    ...style,
                    display: display
                }}
                onClick={handleCopy}
            >
                {getClippyIcon()}
            </span>
        </span>
    );
};

export default CopyToClipboard;
