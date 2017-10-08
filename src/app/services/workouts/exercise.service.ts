import { Injectable } from '@angular/core';
import { Exercise } from '../../models';
import { RepositoryClient } from '../../../lib/repository';
import { BaseTypeService } from '../base/base-type.service';

@Injectable()
export class ExerciseService extends BaseTypeService<Exercise> {
 
    constructor(repositoryClient: RepositoryClient) {
        super (repositoryClient, {
            type: 'Exercise',
            allowDelete: true
        });
    }
}
