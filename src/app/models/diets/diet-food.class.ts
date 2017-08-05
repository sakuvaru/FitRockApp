import { BaseItem } from '../../../lib/repository';
import { Diet } from './diet.class';
import { Food } from './food.class';

export class DietFood extends BaseItem {
    public unitValue: string;
    public eatTime: string;
    public notes: string;
    public order: number;
    public dietId: number;
    public foodId: number;
    
    public diet: Diet;
    public food: Food;
}