import { Food } from './food.class';

export class NewChildFoodVirtualModel {
    constructor(
        public foodId: number,
        public amount: number,
        public unitCode: string,
        public food: Food,
        public foodDishId?: number,
    ) { }
}

export class FoodWithAmountModel {
    constructor(
        public food: Food,
        public amount: number
    ) { }
}
