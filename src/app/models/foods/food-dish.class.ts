import { BaseItem } from '../../../lib/repository';
import { Food } from './food.class';

export class FoodDish extends BaseItem {
    public unitValue: string;
    public notes: string;
    public order: number;
    public foodId: number;

    public food: Food;
}
