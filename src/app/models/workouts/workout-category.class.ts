import { BaseItem } from '../../../lib/repository';

export class WorkoutCategory extends BaseItem {
    public categoryName: string;
}

export class WorkoutCategoryListWithWorkoutsCount {

    public id: number;
    public codename: string;
    public categoryName: string;
    public workoutsCount: number;
}
