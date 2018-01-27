import { Observable } from 'rxjs/Rx';

import { BoxColors } from '../shared/box-colors';
import { TextAlignEnum } from '../../shared/enums/text-align.enum';

export class MiniBoxConfig {
    constructor(
        public title: Observable<string>,
        public titleAlign: TextAlignEnum,
        public text: Observable<string>,
        public color: BoxColors
    ) { }
}
