import { BaseItem } from '../../../lib/repository';

export class FoodCategory extends BaseItem {
}

export class FoodCategoryWithFoodsCountDto {

    public id: number;
    public codename: string;
    public foodsCount: number;
}
