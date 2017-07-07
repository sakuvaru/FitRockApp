import { Injectable } from '@angular/core';
import { WorkoutCategory, WorkoutCategoryListWithWorkoutsCount } from '../models';
import { RepositoryClient, MultipleItemQuery } from '../../lib/repository';
import { BaseTypeService } from '../core';

@Injectable()
export class WorkoutCategoryService extends BaseTypeService<WorkoutCategory>{

    constructor(repositoryClient: RepositoryClient) { 
        super (repositoryClient, {
            type: 'WorkoutCategory',
            allowDelete: true
        })
    }

    getCategoriesWithWorkoutsCount(): MultipleItemQuery<WorkoutCategoryListWithWorkoutsCount>{
        return this.itemsWithCustomModel<WorkoutCategoryListWithWorkoutsCount>()
            .withCustomAction('GetCategoriesWithWorkoutsCount');
    }
}