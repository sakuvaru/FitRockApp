import { BaseItem } from '../../../lib/repository';

export class FoodCategory extends BaseItem {
    public categoryName: string;
}

export class FoodCategoryWithFoodsCountDto {

    public id: number;
    public codename: string;
    public categoryName: string;
    public foodsCount: number;
}
