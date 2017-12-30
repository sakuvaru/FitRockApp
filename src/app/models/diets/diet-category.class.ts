import { BaseItem } from '../../../lib/repository';

export class DietCategory extends BaseItem {
}

export class DietCategoryWithDietsCountDto {
    
    public id: number;
    public codename: string;
    public dietsCount: number;
}
