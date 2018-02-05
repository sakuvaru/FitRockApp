import { BaseItem } from '../../../lib/repository';
import { User } from '../user.class';
import { WorkoutCategory } from './workout-category.class';
import { WorkoutExercise } from './workout-exercise.class';

export class Workout extends BaseItem {

    public workoutName: string;
    public description: string;
    public workoutCategoryId: number;
    public workoutCategory: WorkoutCategory;
    public clientId?: number;
    public client?: User;
    public order: number;
    public dayString: string;
    public day: number;

    public workoutExercises: WorkoutExercise[];
    
}
