import { BaseItem } from '../../lib/repository';

export class WorkoutCategory extends BaseItem {
    public categoryName: string;
}

export class WorkoutCategoryListWithWorkoutsCount extends WorkoutCategory {
    public workoutsCount: number;
}