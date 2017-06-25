import { BaseItem } from '../../lib/repository';
import { Exercise } from './exercise.class';
import { Workout } from './workout.class';

export class WorkoutExercise extends BaseItem {

    public reps: number;
    public sets: number;
    public notes: string;
    public exercise: Exercise;
    public workout: Workout; 
    public order: number;
}