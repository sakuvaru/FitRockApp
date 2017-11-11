import { BaseItem } from '../../../lib/repository';

export class DietCategory extends BaseItem {
    public categoryName: string;
}

export class DietCategoryWithDietsCountDto {
    
    public id: number;
    public codename: string;
    public categoryName: string;
    public dietsCount: number;
}
