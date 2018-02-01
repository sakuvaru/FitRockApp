import { Observable } from 'rxjs/Rx';
import { TextAlignEnum } from '../../shared/enums/text-align.enum';

export class TableBoxConfig {

    public wrapInCard: boolean = false;
    public title?: Observable<string>;
    public titleAlign: TextAlignEnum = TextAlignEnum.Left;

    constructor(
        public lines: Observable<TableBoxLine[]>,
        public options?: {
            wrapInCard?: boolean,
            title?: Observable<string>,
            titleAlign?: TextAlignEnum,
        }
    ) {
        if (options) {
            Object.assign(this, options);
        }
    }
}

export class TableBoxLine {
    constructor(
        public text: Observable<string>,
        public value: Observable<string>
    ) { }
}
