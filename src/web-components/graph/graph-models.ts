export class SingleSeries {
    constructor(
        public name: string,
        public value: number
    ) { }
}

export class MultiSeries {
    constructor(
        public name: string,
        public series: SingleSeries[]
    ) { }
}
