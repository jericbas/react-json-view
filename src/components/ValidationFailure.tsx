import type React from 'react';
import dispatcher from '../helpers/dispatcher';
import Theme from '../themes/getStyle';
import type { ThemeKeys, ThemeObject } from '../types';
import { Add as Clear } from './icons';

export interface ValidationFailureProps {
    message?: string;
    active?: boolean;
    theme?: ThemeKeys | ThemeObject;
    rjvId: string;
}

export const ValidationFailure: React.FC<ValidationFailureProps> = ({
    message = 'Validation Error',
    active = false,
    theme = 'rjv-default',
    rjvId
}) => {
    if (!active) {
        return null;
    }

    return (
        <div
            className="validation-failure"
            {...Theme(theme, 'validation-failure')}
            onClick={() => {
                dispatcher.dispatch({
                    rjvId: rjvId,
                    name: 'RESET'
                });
            }}
        >
            <span {...Theme(theme, 'validation-failure-label')}>
                {message}
            </span>
            <Clear {...Theme(theme, 'validation-failure-clear')} />
        </div>
    );
};

export default ValidationFailure;
