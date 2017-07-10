import { Injectable } from '@angular/core';
import { ExerciseCategory, ExerciseCategoryListWithExercisesCount } from '../models';
import { RepositoryClient, MultipleItemQuery } from '../../lib/repository';
import { BaseTypeService } from '../core';

@Injectable()
export class ExerciseCategoryService extends BaseTypeService<ExerciseCategory>{

    constructor(repositoryClient: RepositoryClient) { 
        super (repositoryClient, {
            type: 'ExerciseCategory',
            allowDelete: true
        })
    }

    getCategoriesWithExercisesCount(exerciseName: string, takeAllExercises: boolean): MultipleItemQuery<ExerciseCategoryListWithExercisesCount>{
        return this.itemsWithCustomModel<ExerciseCategoryListWithExercisesCount>()
            .withCustomOption('exerciseName', exerciseName)
            .withCustomOption('takeAllExercises', takeAllExercises)
            .withCustomAction('GetCategoriesWithExercisesCount');
    }
}