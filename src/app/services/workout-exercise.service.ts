import { Injectable } from '@angular/core';
import { WorkoutExercise } from '../models';
import { RepositoryClient } from '../../lib/repository';
import { BaseTypeService } from '../core';

@Injectable()
export class WorkoutExerciseService extends BaseTypeService<WorkoutExercise>{

    constructor(repositoryClient: RepositoryClient) { 
        super (repositoryClient, "WorkoutExercise")
    }
}