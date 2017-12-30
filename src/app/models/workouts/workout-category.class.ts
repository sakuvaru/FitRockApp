import { BaseItem } from '../../../lib/repository';

export class WorkoutCategory extends BaseItem {
}

export class WorkoutCategoryListWithWorkoutsCount {

    public id: number;
    public codename: string;
    public workoutsCount: number;
}
