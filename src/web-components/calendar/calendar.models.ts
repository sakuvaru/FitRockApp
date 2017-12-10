import { CalendarColor } from './calendar.enums';

export class CalendarEventModel<TModel> {

    constructor(
        public model: TModel,
        public name: string,
        public date: Date,
        public color: CalendarColor,
        public eventUsername?: string
    ) { }
}

export class CalendarDeleteResponse {

    constructor(
    ) { }
}
