import { BaseItem } from '../../lib/repository';
import { WorkoutCategory } from './workout-category.class';

export class Workout extends BaseItem {

    public workoutName: string;
    public description: string;
    public workoutCategoryId: number;
    public workoutCategory: WorkoutCategory
}