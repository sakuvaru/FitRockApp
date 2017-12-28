import { Observable } from 'rxjs/Rx';
import { InfoBoxLineType } from './info-box-line-type.enum';
import { ActionButton } from '../shared/shared.models';

export class InfoBoxText {
    constructor(
        public text: Observable<string> | string,
        public type: InfoBoxLineType = InfoBoxLineType.Body1,
        public linkUrl?: string,
    ) { }
}

export class InfoBoxLine {
    constructor(
        public parts: Observable<InfoBoxText[]> | InfoBoxText[],
        public icon?: string,
    ) { }
}

export class InfoBoxConfig {

    public noDataMessage?: Observable<string>;
    public actions?: ActionButton[];

    constructor(
        public lines: Observable<InfoBoxLine[]>,
        public title: Observable<string>,
        private options?: {
            noDataMessage?: Observable<string>,
            actions?: ActionButton[]
        }
    )  {
        if (options) {
            Object.assign(this, options);
        }
    }
}

