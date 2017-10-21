import { Injectable } from '@angular/core';
import { Location } from '../../models';
import { RepositoryClient, MultipleItemQuery } from '../../../lib/repository';
import { BaseTypeService } from '../base/base-type.service';

@Injectable()
export class LocationService extends BaseTypeService<Location> {

    constructor(repositoryClient: RepositoryClient) {
        super (repositoryClient, {
            type: 'Location',
            allowDelete: true
        });
    }
}
