export interface ParsedInput {
    type: string | false;
    value: unknown;
}

export default function parseInput(input: string): ParsedInput {
    //following code is to make a best guess at
    //the type for a variable being submitted.

    //we are working with a serialized data representation
    input = input.trim();
    try {
        const parsed = JSON.parse(input);
        const serialized = JSON.stringify(parsed);
        if (serialized[0] === '[') {
            //array
            return formatResponse('array', parsed);
        } else if (serialized[0] === '{') {
            //object
            return formatResponse('object', parsed);
        } else if (input.match(/^-?\d+\.\d+$/)) {
            //float
            return formatResponse('float', parseFloat(input));
        } else if (input.match(/^-?\d+e-\d+$/)) {
            //scientific float
            return formatResponse('float', Number(input));
        } else if (input.match(/^-?\d+$/)) {
            //integer
            return formatResponse('integer', parseInt(input, 10));
        } else if (input.match(/^-?\d+e\+\d+$/)) {
            //scientific integer
            return formatResponse('integer', Number(input));
        }
    } catch {
        // no-op
    }

    //run in case input was not serializable
    const lower = input.toLowerCase();
    switch (lower) {
        case 'undefined': {
            return formatResponse('undefined', undefined);
        }
        case 'nan': {
            return formatResponse('nan', NaN);
        }
        case 'null': {
            return formatResponse('null', null);
        }
        case 'true': {
            return formatResponse('boolean', true);
        }
        case 'false': {
            return formatResponse('boolean', false);
        }
        default: {
            //check to see if this is a date
            const parsedDate = Date.parse(input);
            if (!Number.isNaN(parsedDate)) {
                return formatResponse('date', new Date(parsedDate));
            }
        }
    }

    return formatResponse(false, null);
}

function formatResponse(type: string | false, value: unknown): ParsedInput {
    return {
        type: type,
        value: value
    };
}
