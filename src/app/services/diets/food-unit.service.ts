import { Injectable } from '@angular/core';
import { FoodUnit } from '../../models';
import { RepositoryClient } from '../../../lib/repository';
import { BaseTypeService } from '../base/base-type.service';

@Injectable()
export class FoodUnitService extends BaseTypeService<FoodUnit>{

    constructor(repositoryClient: RepositoryClient) { 
        super (repositoryClient, {
            type: 'FoodUnit',
            allowDelete: false
        })
    }
}