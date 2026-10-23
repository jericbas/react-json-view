import { Dispatcher } from 'flux';

export interface DispatcherPayload {
    rjvId: string;
    name: string;
    data?: any;
}

const dispatcher = new Dispatcher<DispatcherPayload>();
export default dispatcher;
