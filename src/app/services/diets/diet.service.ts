import { Injectable } from '@angular/core';
import { Diet } from '../../models';
import { RepositoryClient, PostQuery } from '../../../lib/repository';
import { BaseTypeService } from '../base/base-type.service';
import { numberHelper } from 'lib/utilities';
import { FoodService } from '../foods/food.service';
import { SingleSeriesResponse } from 'app/services/progress/progress-models';

@Injectable()
export class DietService extends BaseTypeService<Diet> {

    private foodService: FoodService;

    constructor(repositoryClient: RepositoryClient) {
        super (repositoryClient, {
            type: 'Diet',
            allowDelete: true
        });

        this.foodService = new FoodService(repositoryClient);
    }

    getNutritionDistribution(dietId: number): PostQuery<SingleSeriesResponse> {
        const query = this.post<SingleSeriesResponse>('GetNutritionDistribution')
            .withJsonOption('DietId', dietId);

        return query;
    }

     copyFromDiet(dietId: number, clientId: number): PostQuery<Diet> {
        return super.post<Diet>('CopyFromDiet')
            .withJsonData({
                'dietId': dietId,
                'clientId': clientId
            });
    }

    aggregateNutrition(diet: Diet, roundTo: number = 1): {
        kcal: number,
        fat: number,
        sugar: number,
        prot: number,
        cho: number,
        nacl: number
    } {
        let kcal = 0;
        let fat = 0;
        let sugar = 0;
        let prot = 0;
        let cho = 0;
        let nacl = 0;

        if (diet && diet.dietFoods) {
            diet.dietFoods.forEach(dietFood => {
                const foodCalculation = this.foodService.calculateFoodWithAmount(dietFood.food, dietFood.amount, 1);
                kcal += foodCalculation.kcal;
                fat += foodCalculation.fat;
                sugar += foodCalculation.sugar;
                prot += foodCalculation.prot;
                cho += foodCalculation.cho;
                nacl += foodCalculation.nacl;
            });
        }
        
        return {
            cho: numberHelper.roundTo(cho, roundTo),
            fat: numberHelper.roundTo(fat, roundTo),
            kcal: numberHelper.roundTo(kcal, roundTo),
            nacl: numberHelper.roundTo(nacl, roundTo),
            prot: numberHelper.roundTo(prot, roundTo),
            sugar: numberHelper.roundTo(sugar, roundTo),
        };
    }
}
