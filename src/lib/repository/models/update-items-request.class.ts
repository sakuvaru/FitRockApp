export class UpdateItemsRequest {
    constructor(
        public distinguishByValue: number,
        public orderItems: OrderItem[]
    ) { }
}

export class OrderItem {
    constructor(
        public id: number,
        public position: number
    ) { }
}
