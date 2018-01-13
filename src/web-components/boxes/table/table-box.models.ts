import { Observable } from 'rxjs/Rx';

export class TableBoxConfig {
    constructor(
        public title: Observable<string>,
        public lines: Observable<TableBoxLine[]>,
    ) { }
}

export class TableBoxLine {
    constructor(
        public text: Observable<string>,
        public value: Observable<string>
    ) { }
}
