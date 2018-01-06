import { Injectable } from '@angular/core';
import { FoodCategory, FoodCategoryWithFoodsCountDto } from '../../models';
import { RepositoryClient, MultipleItemQueryCustom } from '../../../lib/repository';
import { BaseTypeService } from '../base/base-type.service';

@Injectable()
export class FoodCategoryService extends BaseTypeService<FoodCategory> {

    constructor(repositoryClient: RepositoryClient) {
        super (repositoryClient, {
            type: 'FoodCategory',
            allowDelete: false
        });
    }

    getFoodCategoryWithFoodsCountDto(foodName: string, byCurrentUser: boolean, takeOnlyGlobal: boolean, isDishFood: boolean, takeOnlyApproved: boolean): MultipleItemQueryCustom<FoodCategoryWithFoodsCountDto> {
        return this.customItems<FoodCategoryWithFoodsCountDto>()
            .withCustomOption('foodName', foodName)
            .withCustomOption('byCurrentUser', byCurrentUser)
            .withCustomOption('takeOnlyGlobal', takeOnlyGlobal)
            .withCustomOption('isDishFood', isDishFood)
            .withCustomOption('takeOnlyApproved', takeOnlyApproved)
            .withCustomAction('FoodCategoryWithFoodsCountDto');
    }
}