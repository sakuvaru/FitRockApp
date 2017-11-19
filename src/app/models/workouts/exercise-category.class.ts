import { BaseItem } from '../../../lib/repository';

export class ExerciseCategory extends BaseItem {
    public categoryName: string;
}

export class ExerciseCategoryListWithExercisesCount {

    public id: number;
    public codename: string;
    public categoryName: string;
    public exercisesCount: number;
}
