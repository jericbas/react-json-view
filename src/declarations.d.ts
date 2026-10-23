declare module 'react-base16-styling' {
    export function createStyling(
        getThemeStyling: (theme: any) => any,
        options?: { defaultBase16?: any }
    ): (theme: any) => (component: string, args?: any) => { style: React.CSSProperties; [key: string]: any };
    export function invertTheme(theme: any): any;
    export function getBase16Theme(theme: any): any;
}

declare module 'events' {
    export class EventEmitter {
        on(event: string, listener: (...args: any[]) => void): this;
        removeListener(event: string, listener: (...args: any[]) => void): this;
        emit(event: string, ...args: any[]): boolean;
    }
}
