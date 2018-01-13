import { Observable } from 'rxjs/Rx';

import { BoxColors } from '../shared/box-colors';

export class MiniBoxConfig {
    constructor(
        public title: Observable<string>,
        public text: Observable<string>,
        public color: BoxColors
    ) { }
}
