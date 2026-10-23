import { EventEmitter } from 'events';
import dispatcher, { type DispatcherPayload } from '../helpers/dispatcher';
import { toType } from '../helpers/util';

//store persistent display attributes for objects and arrays
class ObjectAttributes extends EventEmitter {
    objects: Record<string, Record<string, Record<string, any>>> = {};

    set = (rjvId: string, name: string, key: string, value: any): void => {
        if (this.objects[rjvId] === undefined) {
            this.objects[rjvId] = {};
        }
        const rjvObj = this.objects[rjvId]!;
        if (rjvObj[name] === undefined) {
            rjvObj[name] = {};
        }
        rjvObj[name]![key] = value;
    };

    get = (rjvId: string, name: string, key: string, default_value?: any): any => {
        if (
            this.objects[rjvId] === undefined ||
            this.objects[rjvId]![name] === undefined ||
            this.objects[rjvId]![name]![key] === undefined
        ) {
            return default_value;
        }
        return this.objects[rjvId]![name]![key];
    };

    handleAction = (action: DispatcherPayload): void => {
        const { rjvId, data, name } = action;
        switch (name) {
            case 'RESET':
                this.emit('reset-' + rjvId);
                break;
            case 'VARIABLE_UPDATED':
                action.data.updated_src = this.updateSrc(rjvId, data);
                this.set(rjvId, 'action', 'variable-update', {
                    ...data,
                    type: 'variable-edited'
                });
                this.emit('variable-update-' + rjvId);
                break;
            case 'VARIABLE_REMOVED':
                action.data.updated_src = this.updateSrc(rjvId, data);
                this.set(rjvId, 'action', 'variable-update', {
                    ...data,
                    type: 'variable-removed'
                });
                this.emit('variable-update-' + rjvId);
                break;
            case 'VARIABLE_ADDED':
                action.data.updated_src = this.updateSrc(rjvId, data);
                this.set(rjvId, 'action', 'variable-update', {
                    ...data,
                    type: 'variable-added'
                });
                this.emit('variable-update-' + rjvId);
                break;
            case 'ADD_VARIABLE_KEY_REQUEST':
                this.set(rjvId, 'action', 'new-key-request', data);
                this.emit('add-key-request-' + rjvId);
                break;
        }
    };

    updateSrc = (rjvId: string, request: any): any => {
        const {
            name,
            new_value,
            variable_removed
        } = request;
        const namespace = [...request.namespace];

        namespace.shift();

        //deeply copy src
        const src = this.get(rjvId, 'global', 'src');
        //deep copy of src variable
        let updated_src = this.deepCopy(src, [...namespace]);

        //point at current index
        let walk: any = updated_src;
        for (const idx of namespace) {
            walk = walk[idx];
        }

        if (variable_removed) {
            if (toType(walk) === 'array') {
                walk.splice(name, 1);
            } else {
                delete walk[name];
            }
        } else {
            //update copied variable at specified namespace
            if (name !== null) {
                walk[name] = new_value;
            } else {
                updated_src = new_value;
            }
        }

        this.set(rjvId, 'global', 'src', updated_src);

        return updated_src;
    };

    deepCopy = (src: any, copy_namespace: Array<string | number>): any => {
        const type = toType(src);
        let result: any;
        const idx = copy_namespace.shift();
        if (type === 'array') {
            result = [...src];
        } else if (type === 'object') {
            result = { ...src };
        }
        if (idx !== undefined && result !== undefined) {
            result[idx] = this.deepCopy(src[idx], copy_namespace);
        }
        return result;
    };
}

const attributeStore = new ObjectAttributes();
dispatcher.register(attributeStore.handleAction.bind(attributeStore));
export default attributeStore;
