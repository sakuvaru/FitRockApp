import { Observable } from 'rxjs/Rx';
import { InfoBoxLineType } from './info-box-line-type.enum';

export class InfoBoxLine {
    constructor(
        public text: Observable<string> | string,
        public type: InfoBoxLineType = InfoBoxLineType.Body1,
        public linkUrl?: string,
        public icon?: string,
    ) { }
}

export class InfoBoxConfig {

    public noDataMessage?: Observable<string>;

    constructor(
        public lines: Observable<InfoBoxLine[]>,
        public title: Observable<string>,
        private options?: {
            noDataMessage?: Observable<string>,
        }
    )  {
        if (options) {
            Object.assign(this, options);
        }
    }
}

