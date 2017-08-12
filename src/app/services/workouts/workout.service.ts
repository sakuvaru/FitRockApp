import { Injectable } from '@angular/core';
import { Workout } from '../../models';
import { RepositoryClient, PostQuery } from '../../../lib/repository';
import { BaseTypeService } from '../base/base-type.service';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class WorkoutService extends BaseTypeService<Workout>{

    constructor(repositoryClient: RepositoryClient) {
        super(repositoryClient, {
            type: 'Workout',
            allowDelete: true
        })
    }

    copyFromWorkout(workoutId: number, clientId: number): PostQuery<Workout> {
        return super.post<Workout>('CopyFromWorkout')
            .withJsonData({
                'workoutId': workoutId,
                'clientId': clientId
            });
    }

    clientHasAssignedWorkout(clientId: number): Observable<boolean> {
        return super.items()
            .whereEquals('ClientId', clientId)
            .limit(1)
            .get()
            .map(response => !response.isEmpty());
    }
}