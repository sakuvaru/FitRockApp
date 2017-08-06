import { BaseItem } from '../../../lib/repository';

export class FoodCategory extends BaseItem {
    public categoryName: string;
}

export class FoodCategoryWithFoodsCountDto extends FoodCategory{
    public foodsCount: number;
}