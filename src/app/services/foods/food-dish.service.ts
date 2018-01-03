import { Injectable } from '@angular/core';
import { FoodDish } from '../../models';
import { RepositoryClient, PostQuery } from '../../../lib/repository';
import { BaseTypeService } from '../base/base-type.service';

@Injectable()
export class FoodDishService extends BaseTypeService<FoodDish> {

    constructor(repositoryClient: RepositoryClient) {
        super (repositoryClient, {
            type: 'FoodDish',
            allowDelete: true
        });
    }
}
