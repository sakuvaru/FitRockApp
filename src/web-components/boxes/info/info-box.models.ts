import { Observable } from 'rxjs/Rx';
import { InfoBoxLineType } from './info-box-line-type.enum';
import { ActionButton } from '../shared/shared.models';
import { TextAlignEnum } from '../../shared/enums/text-align.enum';

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

    public wrapInCard: boolean = false;
    public title?: Observable<string>;
    public titleAlign: TextAlignEnum = TextAlignEnum.Left;
    public noDataMessage?: Observable<string>;
    public actions?: ActionButton[];

    constructor(
        public lines: Observable<InfoBoxLine[]>,

        private options?: {
            noDataMessage?: Observable<string>,
            actions?: ActionButton[],
            title?: Observable<string>,
            titleAlign?: TextAlignEnum,
            wrapInCard?: boolean
        }
    ) {
        if (options) {
            Object.assign(this, options);
        }
    }
}

