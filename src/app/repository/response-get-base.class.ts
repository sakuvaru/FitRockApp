export class ResponseGetBase {
    constructor(
        public fromCache: boolean,
        public timeCreated: Date,
        public type: string,
        public action: string,
        public result: number
    ) { }
}