import { Injectable } from '@angular/core';
import { Food, FoodWithAmountModel } from '../../models';
import { RepositoryClient, PostQuery } from '../../../lib/repository';
import { BaseTypeService } from '../base/base-type.service';

@Injectable()
export class FoodService extends BaseTypeService<Food> {

    constructor(repositoryClient: RepositoryClient) {
        super(repositoryClient, {
            type: 'Food',
            allowDelete: true
        });
    }

    calculateFoodWithAmount(food: Food, amount: number): {
        kcal: number,
        fat: number,
        sugar: number,
        prot: number,
        cho: number,
        nacl: number,
        resultCanBeIncorrectDueToMissingNutrition: boolean
    } {
        let kcal = 0;
        let fat = 0;
        let sugar = 0;
        let prot = 0;
        let cho = 0;
        let nacl = 0;
        let resultCanBeIncorrectDueToMissingNutrition = false;

        if (food.fat) {
            fat += this.calculateUnitValue(amount, food.fat);
        } else {
            resultCanBeIncorrectDueToMissingNutrition = true;
        }

        if (food.sugar) {
            sugar += this.calculateUnitValue(amount, food.sugar);
        } else {
            resultCanBeIncorrectDueToMissingNutrition = true;
        }

        if (food.prot) {
            prot += this.calculateUnitValue(amount, food.prot);
        } else {
            resultCanBeIncorrectDueToMissingNutrition = true;
        }

        if (food.cho) {
            cho += this.calculateUnitValue(amount, food.cho);
        } else {
            resultCanBeIncorrectDueToMissingNutrition = true;
        }

        if (food.nacl) {
            nacl += this.calculateUnitValue(amount, food.nacl);
        } else {
            resultCanBeIncorrectDueToMissingNutrition = true;
        }

        kcal = (fat * 9) + ((prot + cho) * 4);

        return {
            cho: cho,
            fat: fat,
            kcal: kcal,
            nacl: nacl,
            prot: prot,
            sugar: sugar,
            resultCanBeIncorrectDueToMissingNutrition: resultCanBeIncorrectDueToMissingNutrition
        };
    }

    /**
     * Calculates total number of kcal from given foods
     * @param foods foods
     */
    aggregateFoodsNutrition(foodsWithAmount: FoodWithAmountModel[]): {
        kcal: number,
        fat: number,
        sugar: number,
        prot: number,
        cho: number,
        nacl: number,
        resultCanBeIncorrectDueToMissingNutrition: boolean
    } {
        let kcal = 0;
        let fat = 0;
        let sugar = 0;
        let prot = 0;
        let cho = 0;
        let nacl = 0;
        let resultCanBeIncorrectDueToMissingNutrition = false;

        if (foodsWithAmount && foodsWithAmount.length > 0) {
            foodsWithAmount.forEach(foodWithAmount => {
                const calculation = this.calculateFoodWithAmount(foodWithAmount.food, foodWithAmount.amount);

                kcal += calculation.kcal;
                fat += calculation.fat;
                sugar += calculation.sugar;
                prot += calculation.prot;
                cho += calculation.cho;
                nacl += calculation.nacl;
                if (calculation.resultCanBeIncorrectDueToMissingNutrition) {
                    resultCanBeIncorrectDueToMissingNutrition = true;
                }
            });
        }

        return {
            cho: cho,
            fat: fat,
            kcal: kcal,
            nacl: nacl,
            prot: prot,
            sugar: sugar,
            resultCanBeIncorrectDueToMissingNutrition: resultCanBeIncorrectDueToMissingNutrition
        };
    }

    calculateUnitValue(unitValue: number, valuePerMeasurementUnit: number): number {
        return valuePerMeasurementUnit / 100 * unitValue;
    }
}
