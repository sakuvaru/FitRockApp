import { BaseItem } from '../../../lib/repository';
import { ExerciseCategory } from './exercise-category.class';

export class Exercise extends BaseItem {

    public exerciseName: string;
    public description: string;
    public videoUrl: string;
    public exerciseCategory: ExerciseCategory;
}
