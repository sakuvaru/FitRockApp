import { BaseItem } from '../../../lib/repository';

export class FoodCategory extends BaseItem {

    public isFoodCategory: boolean;
    public isMealCategory: boolean;
}

export class FoodCategoryWithFoodsCountDto {

    public id: number;
    public codename: string;
    public foodsCount: number;
}
