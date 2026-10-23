import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { JsonViewState } from '../../src/context/JsonViewContext';
import {
    deepCopy,
    jsonViewReducer,
    updateSrc,
    useJsonView
} from '../../src/context/JsonViewContext';

const ConsumerComponent = () => {
    const { validationMessage, validationFailure, dispatch } = useJsonView();
    return (
        <div>
            <span data-testid="msg">{validationMessage}</span>
            <span data-testid="status">{validationFailure ? 'failed' : 'ok'}</span>
            <button
                type="button"
                onClick={() => dispatch({ type: 'VALIDATION_FAILURE', payload: true })}
            >
                Fail
            </button>
        </div>
    );
};

describe('JsonViewContext & Reducer (replaces ObjectAttributes)', () => {
    describe('deepCopy', () => {
        it('deeply copies objects along a namespace path', () => {
            const original = { a: { b: { c: 1 } }, d: 2 };
            const copied = deepCopy(original, ['a', 'b']);
            expect(copied).toEqual(original);
            expect(copied).not.toBe(original);
            expect(copied.a).not.toBe(original.a);
            expect(copied.a.b).not.toBe(original.a.b);
        });

        it('deeply copies arrays along a namespace path', () => {
            const original = [1, [2, [3]]];
            const copied = deepCopy(original, [1, 1]);
            expect(copied).toEqual(original);
            expect(copied).not.toBe(original);
            expect(copied[1]).not.toBe(original[1]);
        });
    });

    describe('updateSrc', () => {
        it('updates a variable in an object', () => {
            const src = { key1: 'old', key2: 'stay' };
            const updated = updateSrc(src, {
                name: 'key1',
                namespace: ['root'],
                new_value: 'new'
            });
            expect(updated).toEqual({ key1: 'new', key2: 'stay' });
            expect(src.key1).toBe('old');
        });

        it('removes a variable from an object', () => {
            const src = { key1: 'value1', key2: 'value2' };
            const updated = updateSrc(src, {
                name: 'key1',
                namespace: ['root'],
                variable_removed: true
            });
            expect(updated).toEqual({ key2: 'value2' });
        });

        it('removes a variable from an array', () => {
            const src = ['a', 'b', 'c'];
            const updated = updateSrc(src, {
                name: 1,
                namespace: ['root'],
                variable_removed: true
            });
            expect(updated).toEqual(['a', 'c']);
        });

        it('updates root value when name is null', () => {
            const src = 'old';
            const updated = updateSrc(src, {
                name: null,
                namespace: ['root'],
                new_value: 'new'
            });
            expect(updated).toBe('new');
        });
    });

    describe('jsonViewReducer', () => {
        const initialState: JsonViewState = {
            src: { name: 'test', count: 0 },
            name: 'root',
            theme: 'rjv-default',
            validationMessage: 'Validation Error',
            addKeyRequest: null,
            validationFailure: false,
            expanded: {},
            collapsed: {}
        };

        it('handles VARIABLE_UPDATED', () => {
            const nextState = jsonViewReducer(initialState, {
                type: 'VARIABLE_UPDATED',
                payload: {
                    name: 'count',
                    namespace: ['root'],
                    new_value: 5
                }
            });
            expect(nextState.src.count).toBe(5);
        });

        it('handles ADD_VARIABLE_KEY_REQUEST', () => {
            const req = {
                existing_value: {},
                namespace: ['root'],
                name: 'newKey'
            };
            const nextState = jsonViewReducer(initialState, {
                type: 'ADD_VARIABLE_KEY_REQUEST',
                payload: req
            });
            expect(nextState.addKeyRequest).toEqual(req);
        });

        it('handles SET_EXPANDED and TOGGLE_EXPANDED', () => {
            let state = jsonViewReducer(initialState, {
                type: 'SET_EXPANDED',
                payload: { key: 'root.item', expanded: true }
            });
            expect(state.expanded['root.item']).toBe(true);

            state = jsonViewReducer(state, {
                type: 'TOGGLE_EXPANDED',
                payload: { key: 'root.item' }
            });
            expect(state.expanded['root.item']).toBe(false);
        });

        it('handles SET_COLLAPSED and TOGGLE_COLLAPSED', () => {
            let state = jsonViewReducer(initialState, {
                type: 'SET_COLLAPSED',
                payload: { key: 'root.item', collapsed: true }
            });
            expect(state.collapsed['root.item']).toBe(true);

            state = jsonViewReducer(state, {
                type: 'TOGGLE_COLLAPSED',
                payload: { key: 'root.item' }
            });
            expect(state.collapsed['root.item']).toBe(false);
        });

        it('handles VALIDATION_FAILURE', () => {
            const state = jsonViewReducer(initialState, {
                type: 'VALIDATION_FAILURE',
                payload: true
            });
            expect(state.validationFailure).toBe(true);
        });

        it('handles RESET_PROPS', () => {
            const state = jsonViewReducer(initialState, {
                type: 'RESET_PROPS',
                payload: {
                    src: { fresh: true },
                    name: 'newRoot'
                }
            });
            expect(state.src).toEqual({ fresh: true });
            expect(state.name).toBe('newRoot');
        });
    });

    describe('useJsonView hook', () => {
        it('reads context values and provides helpers', () => {
            render(<ConsumerComponent />);
            expect(screen.getByTestId('msg')).toHaveTextContent('Validation Error');
            expect(screen.getByTestId('status')).toHaveTextContent('ok');
        });
    });
});
