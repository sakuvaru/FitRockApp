export class LoadMoreResponse {
    constructor(
        public items: any[],
        public pages: number,
        public totalItems: number
    ) {}
}
