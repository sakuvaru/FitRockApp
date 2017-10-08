import { Injectable } from '@angular/core';
import { Food } from '../../models';
import { RepositoryClient, PostQuery } from '../../../lib/repository';
import { BaseTypeService } from '../base/base-type.service';

@Injectable()
export class FoodService extends BaseTypeService<Food> {

    constructor(repositoryClient: RepositoryClient) {
        super (repositoryClient, {
            type: 'Food',
            allowDelete: true
        });
    }
}
