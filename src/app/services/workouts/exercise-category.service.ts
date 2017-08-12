import { Injectable } from '@angular/core';
import { ExerciseCategory, ExerciseCategoryListWithExercisesCount } from '../../models';
import { RepositoryClient, MultipleItemQueryCustom } from '../../../lib/repository';
import { BaseTypeService } from '../base/base-type.service';

@Injectable()
export class ExerciseCategoryService extends BaseTypeService<ExerciseCategory>{

    constructor(repositoryClient: RepositoryClient) { 
        super (repositoryClient, {
            type: 'ExerciseCategory',
            allowDelete: false
        })
    }

    getCategoriesWithExercisesCount(exerciseName: string, takeAllExercises: boolean): MultipleItemQueryCustom<ExerciseCategoryListWithExercisesCount>{
        return this.customItems<ExerciseCategoryListWithExercisesCount>()
            .withCustomOption('exerciseName', exerciseName)
            .withCustomOption('takeAllExercises', takeAllExercises)
            .withCustomAction('GetCategoriesWithExercisesCount');
    }
}