import { BaseItem } from '../../../lib/repository';
import { DietFood } from '../diets/diet-food.class';

export class FoodUnit extends BaseItem {
    public unitCode: string;

    public dietFoods: DietFood[];
}
