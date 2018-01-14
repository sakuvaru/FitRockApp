import { Observable } from 'rxjs/Rx';

import { BoxColors } from '../shared/box-colors';

export class NumberBoxConfig {

    public animate: boolean = true;

    constructor(
        public number: Observable<number>,
        public text: Observable<string>,
        public color: BoxColors,
        public startNumber: number = 0,
        private options?: {
            animate?: boolean
        }
    ) { 
        if (options) {
            Object.assign(this, options);
        }
    }
}
