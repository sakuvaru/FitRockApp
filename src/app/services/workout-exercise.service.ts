import { Injectable } from '@angular/core';
import { WorkoutExercise } from '../models';
import { RepositoryClient, EditItemQuery } from '../../lib/repository';
import { BaseTypeService } from '../core';
import { Observable } from 'rxjs/RX';

@Injectable()
export class WorkoutExerciseService extends BaseTypeService<WorkoutExercise>{

    constructor(repositoryClient: RepositoryClient) {
        super(repositoryClient, "WorkoutExercise")
    }

    orderWorkoutExercises(workoutExercises: WorkoutExercise[]): Observable<any> {
        if (!workoutExercises) {
            return null;
        }

        if (!Array.isArray(workoutExercises)) {
            throw Error(`Cannot bulk update because provided items are not in array`);
        }

        if (workoutExercises.length === 1) {
            // no need to merge if there is only 1 item
            return this.edit(workoutExercises[0]).set();
        }

        var mergedObservable: Observable<any>;
        var merged: any;

        workoutExercises.forEach(workoutExercise => {
            var observable = this.edit(workoutExercise).set();
            if (mergedObservable == null) {
                mergedObservable = observable;
            }
            else {
                mergedObservable = mergedObservable.merge(observable);
            }
        });

        return mergedObservable;
    }
}