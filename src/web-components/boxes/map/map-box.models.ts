import { Observable } from 'rxjs/Rx';
import { ActionButton } from '../shared/shared.models';

export class MapBoxConfig {

    public noDataMessage?: Observable<string>;
    public actions?: ActionButton[];

    constructor(
        public title: Observable<string>,
        public apiKey: string,
        public address: string,
        public lat?: number,
        public lng?: number,
        private options?: {
            zoom?: number,
            noDataMessage?: Observable<string>,
            actions?: ActionButton[]
        }
    )  { 
        if (options) {
            Object.assign(this, options);
        }
    }
}

