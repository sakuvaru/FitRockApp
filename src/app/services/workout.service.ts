import { Injectable } from '@angular/core';
import { Workout } from '../models';
import { RepositoryClient } from '../../lib/repository';
import { BaseTypeService } from '../core';

@Injectable()
export class WorkoutService extends BaseTypeService<Workout>{

    constructor(repositoryClient: RepositoryClient) { 
        super (repositoryClient, {
            type: 'Workout',
            allowDelete: true
        })
    }
}