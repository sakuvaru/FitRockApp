import { Observable } from 'rxjs/Rx';

export class ListBoxItem {
    constructor(
        public text: string,
        public linkUrl?: string,
        public imageUrl?: string, 
        public icon?: string,
    ) { }
}

export class ListBoxConfig {

    public noDataMessage?: Observable<string>;

    /**
     * Indicates if 'FxFlex' directive should be applied to outer box (card)
     * This is useful when boxes need to have identical height
     */
    public useFxFlex?: boolean;

    constructor(
        public items: Observable<ListBoxItem[]>,
        public title: Observable<string>,
        private options?: {
            noDataMessage?: Observable<string>,
            useFxFlex?: boolean
        }
    )  { }
}

