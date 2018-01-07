import { Injectable } from '@angular/core';
import { Food } from '../../models';
import { RepositoryClient, PostQuery } from '../../../lib/repository';
import { BaseTypeService } from '../base/base-type.service';

@Injectable()
export class FoodService extends BaseTypeService<Food> {

    constructor(repositoryClient: RepositoryClient) {
        super (repositoryClient, {
            type: 'Food',
            allowDelete: true
        });
    }

    /**
     * Calculates total number of kcal from given foods
     * @param foods foods
     */
    aggregateFoods(foods: Food[]): {
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

        if (foods && foods.length > 0) {
            foods.forEach(food => {
                if (food.fat) {
                    fat += food.fat;
                }
                if (food.sugar) {
                    sugar += food.sugar;
                }
                if (food.prot) {
                    prot += food.prot;
                }
                if (food.cho) {
                    cho += food.cho;
                }
                if (food.nacl) {
                    nacl += food.nacl;
                }
            });
        }

        kcal = (fat * 9) + ((prot + cho) * 4);

        return {
            cho: cho,
            fat: fat,
            kcal: kcal,
            nacl: nacl,
            prot: prot,
            sugar: sugar
        };
    }
}
