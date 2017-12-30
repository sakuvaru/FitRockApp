import { BaseItem } from '../../../lib/repository';

export class ExerciseCategory extends BaseItem {
}

export class ExerciseCategoryListWithExercisesCount {

    public id: number;
    public codename: string;
    public exercisesCount: number;
}
