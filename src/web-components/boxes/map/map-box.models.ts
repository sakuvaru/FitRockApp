import { Observable } from 'rxjs/Rx';

export class MapBoxConfig {

    public noDataMessage?: Observable<string>;

    constructor(
        public title: Observable<string>,
        public apiKey: string,
        public address: string,
        public lat?: number,
        public lng?: number,
        private options?: {
            zoom?: number,
        }
    )  { }
}

