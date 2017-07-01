import { Injectable } from '@angular/core';
import { WorkoutExercise, Exercise } from '../models';
import { RepositoryClient, EditItemQuery, ResponseCreate, ResponsePost } from '../../lib/repository';
import { BaseTypeService } from '../core';
import { Observable } from 'rxjs/RX';

@Injectable()
export class WorkoutExerciseService extends BaseTypeService<WorkoutExercise>{

    constructor(repositoryClient: RepositoryClient) {
        super(repositoryClient, "WorkoutExercise")
    }

    addWorkoutExercise(exerciseId: number, workoutId: number): Observable<ResponseCreate<WorkoutExercise>>{
        if (!exerciseId || !workoutId){
            throw Error(`Invalid parameters for 'addWorkoutExercise' method`);
        }

        var workoutExercise = new WorkoutExercise();

        workoutExercise.workoutId = workoutId;
        workoutExercise.exerciseId = exerciseId;

        return this.create(workoutExercise).set();
    }

    removeWorkoutExercise(exerciseId: number, workoutId: number): Observable<ResponsePost<any>>{
        if (!exerciseId || !workoutId){
            throw Error(`Invalid parameters for 'addWorkoutExercise' method`);
        }
        
        return this.post('RemoveWorkoutExercise').withJsonData({'exerciseId': exerciseId, 'workoutId': workoutId}).set();
    }
}