export class NewChildFoodVirtualModel {
    constructor(
        public foodId: number,
        public amount: number,
        public foodDishId?: number
    ) { }
}
