import { BaseItem } from '../../../lib/repository';
import { Diet } from './diet.class';
import { Food } from '../foods/food.class';
import { NumberCardModule } from '@swimlane/ngx-charts';

export class DietFood extends BaseItem {
    public amount: number;
    public eatTime: string;
    public notes: string;
    public order: number;
    public dietId: number;
    public foodId: number;

    public diet: Diet;
    public food: Food;
}
