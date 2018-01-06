import { BaseItem } from '../../../lib/repository';
import { Food } from './food.class';

export class FoodDish extends BaseItem {
    public amount: number;
    public notes: string;
    public order: number;
    public foodId: number;
    public parentFoodId: number;

    public parentFood: Food;
    public food: Food;
}
