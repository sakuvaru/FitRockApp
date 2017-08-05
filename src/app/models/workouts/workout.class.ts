import { BaseItem } from '../../../lib/repository';
import { WorkoutCategory } from './workout-category.class';
import { WorkoutExercise } from './workout-exercise.class';
import { User } from '../user.class';

export class Workout extends BaseItem {

    public workoutName: string;
    public description: string;
    public workoutCategoryId: number;
    public workoutCategory: WorkoutCategory;
    public client: User;
    public order: number;
    public workoutExercises: WorkoutExercise[];
}