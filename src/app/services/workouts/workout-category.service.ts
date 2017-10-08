import { Injectable } from '@angular/core';
import { WorkoutCategory, WorkoutCategoryListWithWorkoutsCount } from '../../models';
import { RepositoryClient, MultipleItemQueryCustom } from '../../../lib/repository';
import { BaseTypeService } from '../base/base-type.service';

@Injectable()
export class WorkoutCategoryService extends BaseTypeService<WorkoutCategory> {

    constructor(repositoryClient: RepositoryClient) {
        super(repositoryClient, {
            type: 'WorkoutCategory',
            allowDelete: false
        });
    }

    getCategoryCountForClientWorkouts(workoutName: string): MultipleItemQueryCustom<WorkoutCategoryListWithWorkoutsCount> {
        return this.customItems<WorkoutCategoryListWithWorkoutsCount>()
            .withCustomOption('workoutName', workoutName)
            .withCustomAction('GetCategoryCountForClientWorkouts');
    }

    getCategoryCountForWorkoutTemplates(workoutName: string): MultipleItemQueryCustom<WorkoutCategoryListWithWorkoutsCount> {
        return this.customItems<WorkoutCategoryListWithWorkoutsCount>()
            .withCustomOption('workoutName', workoutName)
            .withCustomAction('GetCategoryCountForWorkoutTemplates');
    }

}
