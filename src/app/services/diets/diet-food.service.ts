import { Injectable } from '@angular/core';
import { DietFood } from '../../models';
import { RepositoryClient, PostQuery } from '../../../lib/repository';
import { BaseTypeService } from '../base/base-type.service';

@Injectable()
export class DietFoodService extends BaseTypeService<DietFood> {

    constructor(repositoryClient: RepositoryClient) {
        super (repositoryClient, {
            type: 'DietFood',
            allowDelete: true
        });
    }
}
