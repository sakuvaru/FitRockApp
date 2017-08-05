import { Injectable } from '@angular/core';
import { FoodCategory, FoodCategoryWithFoodsCountDto } from '../../models';
import { RepositoryClient, MultipleItemQueryCustom } from '../../../lib/repository';
import { BaseTypeService } from '../../core';

@Injectable()
export class FoodCategoryService extends BaseTypeService<FoodCategory>{

    constructor(repositoryClient: RepositoryClient) { 
        super (repositoryClient, {
            type: 'FoodCategory',
            allowDelete: false
        })
    }

    getFoodCategoryWithFoodsCountDto(foodName: string, takeAllFoods: boolean): MultipleItemQueryCustom<FoodCategoryWithFoodsCountDto>{
        return this.customItems<FoodCategoryWithFoodsCountDto>()
            .withCustomOption('foodName', foodName)
            .withCustomOption('takeAllFoods', takeAllFoods)
            .withCustomAction('FoodCategoryWithFoodsCountDto');
    }
}