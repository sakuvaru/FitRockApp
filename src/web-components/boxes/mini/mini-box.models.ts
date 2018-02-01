import { Observable } from 'rxjs/Rx';

import { BoxColors } from '../shared/box-colors';
import { TextAlignEnum } from '../../shared/enums/text-align.enum';

export class MiniBoxConfig {

    public title: Observable<string>;
    public titleAlign: TextAlignEnum = TextAlignEnum.Left;

    constructor(
        public text: Observable<string>,
        public color: BoxColors,
        public options?: {
            title: Observable<string>,
            titleAlign: TextAlignEnum,
        }
    ) {
        if (options) {
            Object.assign(this, options);
        }
    }
}
