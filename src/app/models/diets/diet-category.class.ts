import { BaseItem } from '../../../lib/repository';

export class DietCategory extends BaseItem {
    public categoryName: string;
}

export class DietCategoryWithDietsCountDto extends DietCategory{
    public dietsCount: number;
}