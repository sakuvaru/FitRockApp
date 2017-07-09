import { BaseItem } from '../../lib/repository';

export class ExerciseCategory extends BaseItem {
    public categoryName: string;
}

export class ExerciseCategoryListWithExercisesCount extends ExerciseCategory{
    public exercisesCount: number;
}