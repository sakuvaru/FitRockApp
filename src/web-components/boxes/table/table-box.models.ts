import { Observable } from 'rxjs/Rx';
import { TextAlignEnum } from '../../shared/enums/text-align.enum';

export class TableBoxConfig {
    constructor(
        public title: Observable<string>,
        public titleAlign: TextAlignEnum,
        public lines: Observable<TableBoxLine[]>
    ) { }
}

export class TableBoxLine {
    constructor(
        public text: Observable<string>,
        public value: Observable<string>
    ) { }
}
