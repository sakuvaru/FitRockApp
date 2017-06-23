import { Injectable } from '@angular/core';
import { ExerciseCategory } from '../models';
import { RepositoryClient } from '../../lib/repository';
import { BaseTypeService } from '../core';

@Injectable()
export class ExerciseCategoryService extends BaseTypeService<ExerciseCategory>{

    constructor(repositoryClient: RepositoryClient) { 
        super (repositoryClient, "ExerciseCategory")
    }
}