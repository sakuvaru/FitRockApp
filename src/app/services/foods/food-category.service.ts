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

    getFoodCategoryWithFoodsCountDto(data: {
        foodName: string, 
        byCurrentUser?: boolean, 
        isGlobal?: boolean, 
        isMeal?: boolean, 
        isSupplement?: boolean, 
        isFood?: boolean, 
        isApproved?: boolean,
        isGlobalOrByCurrentUser?: boolean
        }): MultipleItemQueryCustom<FoodCategoryWithFoodsCountDto> {
        return this.customItems<FoodCategoryWithFoodsCountDto>()
            .withCustomOption('foodName', data.foodName)
            .withCustomOption('byCurrentUser', data.byCurrentUser ? data.byCurrentUser : undefined)
            .withCustomOption('isGlobal', data.isGlobal ? data.isGlobal : undefined)
            .withCustomOption('isMeal', data.isMeal ? data.isMeal : undefined)
            .withCustomOption('isSupplement', data.isSupplement ? data.isSupplement : undefined)
            .withCustomOption('isFood', data.isFood ? data.isFood : undefined)
            .withCustomOption('isApproved', data.isApproved ? data.isApproved : undefined)
            .withCustomOption('isGlobalOrByCurrentUser', data.isGlobalOrByCurrentUser ? data.isGlobalOrByCurrentUser : undefined)
            .withCustomAction('FoodCategoryWithFoodsCountDto');
    }
}
