import { Injectable } from '@angular/core';
import { DietCategory, DietCategoryWithDietsCountDto } from '../../models';
import { RepositoryClient, MultipleItemQueryCustom } from '../../../lib/repository';
import { BaseTypeService } from '../base/base-type.service';

@Injectable()
export class DietCategoryService extends BaseTypeService<DietCategory> {

    constructor(repositoryClient: RepositoryClient) {
        super (repositoryClient, {
            type: 'DietCategory',
            allowDelete: false
        });
    }

    getCategoryCountForDietTemplates(dietName: string): MultipleItemQueryCustom<DietCategoryWithDietsCountDto> {
        return this.customItems<DietCategoryWithDietsCountDto>()
            .withCustomOption('dietName', dietName)
            .withCustomAction('GetCategoryCountForDietTemplates');
    }

    getCategoryCountForClientDiets(dietName: string): MultipleItemQueryCustom<DietCategoryWithDietsCountDto> {
        return this.customItems<DietCategoryWithDietsCountDto>()
            .withCustomOption('dietName', dietName)
            .withCustomAction('GetCategoryCountForClientDiets');
    }
}
