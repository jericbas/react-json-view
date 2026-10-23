import type React from 'react';
import dispatcher from '../../helpers/dispatcher';
import ObjectAttributes from '../../stores/ObjectAttributes';
import type { ThemeKeys, ThemeObject, TypeDefaultValue } from '../../types';
import ObjectKeyModal from './ObjectKeyModal';

export interface AddKeyRequestProps {
    active?: boolean;
    theme?: ThemeKeys | ThemeObject;
    rjvId: string;
    defaultValue?: TypeDefaultValue | TypeDefaultValue[] | null;
}

export const AddKeyRequest: React.FC<AddKeyRequestProps> = ({
    active = false,
    theme = 'rjv-default',
    rjvId,
    defaultValue = null
}) => {
    if (!active) {
        return null;
    }

    const isValid = (input: string): boolean => {
        const request = ObjectAttributes.get(
            rjvId,
            'action',
            'new-key-request'
        );
        return (
            input !== '' &&
            request &&
            request.existing_value &&
            Object.keys(request.existing_value).indexOf(input) === -1
        );
    };

    const submit = (input: string): void => {
        const request = ObjectAttributes.get(rjvId, 'action', 'new-key-request');
        if (request) {
            request.new_value = { ...request.existing_value };
            request.new_value[input] = defaultValue;
            dispatcher.dispatch({
                name: 'VARIABLE_ADDED',
                rjvId: rjvId,
                data: request
            });
        }
    };

    return (
        <ObjectKeyModal
            rjvId={rjvId}
            theme={theme}
            isValid={isValid}
            submit={submit}
        />
    );
};

export default AddKeyRequest;
