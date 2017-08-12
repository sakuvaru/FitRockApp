import { Injectable } from '@angular/core';
import { DietCategory, DietCategoryWithDietsCountDto } from '../../models';
import { RepositoryClient, MultipleItemQueryCustom } from '../../../lib/repository';
import { BaseTypeService } from '../base/base-type.service';

@Injectable()
export class DietCategoryService extends BaseTypeService<DietCategory>{

    constructor(repositoryClient: RepositoryClient) { 
        super (repositoryClient, {
            type: 'DietCategory',
            allowDelete: false
        })
    }

    getDietCategoryWithDietsCount(dietName: string, takeAllDiets: boolean): MultipleItemQueryCustom<DietCategoryWithDietsCountDto>{
        return this.customItems<DietCategoryWithDietsCountDto>()
            .withCustomOption('dietName', dietName)
            .withCustomOption('takeAllDiets', takeAllDiets)
            .withCustomAction('DietCategoryWithDietsCount');
    }
}