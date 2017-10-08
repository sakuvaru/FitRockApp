import { Injectable } from '@angular/core';
import { Diet } from '../../models';
import { RepositoryClient, PostQuery } from '../../../lib/repository';
import { BaseTypeService } from '../base/base-type.service';

@Injectable()
export class DietService extends BaseTypeService<Diet> {

    constructor(repositoryClient: RepositoryClient) {
        super (repositoryClient, {
            type: 'Diet',
            allowDelete: true
        });
    }

     copyFromDiet(dietId: number, clientId: number): PostQuery<Diet> {
        return super.post<Diet>('CopyFromDiet')
            .withJsonData({
                'dietId': dietId,
                'clientId': clientId
            });
    }
}
