import { BaseItem } from '../../../lib/repository';
import { DietCategory } from './diet-category.class';
import { User } from '../user.class';
import { DietFood } from './diet-food.class';

export class Diet extends BaseItem {
    public dietName: string;
    public description: string;
    public clientId?: number;
    public order?: number;
    public dietCategoryId: number;

    public dietCategory: DietCategory;
    public client: User;
    public dietFoods: DietFood[];
}
