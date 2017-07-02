import { Injectable } from '@angular/core';
import { WorkoutCategory } from '../models';
import { RepositoryClient } from '../../lib/repository';
import { BaseTypeService } from '../core';

@Injectable()
export class WorkoutCategoryService extends BaseTypeService<WorkoutCategory>{

    constructor(repositoryClient: RepositoryClient) { 
        super (repositoryClient, {
            type: 'WorkoutCategory',
            allowDelete: true
        })
    }
}