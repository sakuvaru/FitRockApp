import { Injectable } from '@angular/core';
import { ProgressItemUnit } from '../../models';
import { RepositoryClient, MultipleItemQueryCustom } from '../../../lib/repository';
import { BaseTypeService } from '../base/base-type.service';

@Injectable()
export class ProgressItemUnitService extends BaseTypeService<ProgressItemUnit> {

    constructor(repositoryClient: RepositoryClient) {
        super (repositoryClient, {
            type: 'ProgressItemUnit',
            allowDelete: false
        });
    }
}
