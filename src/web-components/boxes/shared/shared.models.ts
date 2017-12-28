import { Observable } from 'rxjs/Rx';

export class ActionButton {
    constructor(
        public icon: string,
        public action: Observable<void>,
    ) { }
}
