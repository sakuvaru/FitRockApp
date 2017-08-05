import { BaseItem } from '../../../lib/repository';
import { FoodUnit } from './food-unit.class';
import { FoodCategory } from './food-category.class';

export class Food extends BaseItem {
    public foodName: string;
    public foodCategoryId : number;
    public foodUnitId: number;
    public description: string;
    public kcal: number;
    public fats: number;
    public carbs: number;
    public proteins: number;
    
    public foodUnit: FoodUnit;
    public foodCategory: FoodCategory;
}