import { Observable } from 'rxjs/Rx';
import { ActionButton } from '../shared/shared.models';
import { TextAlignEnum } from '../../shared/enums/text-align.enum';

export class MapBoxConfig {

    public noDataMessage?: Observable<string>;
    public actions?: ActionButton[];

    public zoom: number = 10;

    constructor(
        public title: Observable<string>,
        public titleAlign: TextAlignEnum,
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

