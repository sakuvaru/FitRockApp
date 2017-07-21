import { Injectable } from '@angular/core';
import { WorkoutCategory, WorkoutCategoryListWithWorkoutsCount } from '../models';
import { RepositoryClient, MultipleItemQueryCustom } from '../../lib/repository';
import { BaseTypeService } from '../core';

@Injectable()
export class WorkoutCategoryService extends BaseTypeService<WorkoutCategory>{

    constructor(repositoryClient: RepositoryClient) { 
        super (repositoryClient, {
            type: 'WorkoutCategory',
            allowDelete: true
        })
    }

    getCategoriesWithWorkoutsCount(workoutName: string): MultipleItemQueryCustom<WorkoutCategoryListWithWorkoutsCount>{
        return this.customItems<WorkoutCategoryListWithWorkoutsCount>()
            .withCustomOption('workoutName', workoutName)
            .withCustomAction('GetCategoriesWithWorkoutsCount');
    }
}