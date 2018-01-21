import { BaseItem, LanguageEnum, languageHelper } from '../../../lib/repository';
import { FoodUnit } from './food-unit.class';
import { FoodCategory } from './food-category.class';
import { DietFood } from '../diets/diet-food.class';
import { FoodDish } from './food-dish.class';

export class Food extends BaseItem {
    public foodName: string;
    public foodCategoryId: number;
    public foodUnitId: number;
    public foodUnitMeasurementValue: number;
    public isGlobal: boolean;
    public isApproved: boolean;
    public description?: string;
    public kcal: number;
    public fat: number;
    public cho: number;
    public prot: number;
    public sugar: number;
    public nacl: number;
    public language: LanguageEnum;
    public isMeal: boolean;
    public isFood: boolean;
    public isSupplement: boolean;

    public childFoods: FoodDish[];
    public foodDishes: FoodDish[];
    public foodUnit: FoodUnit;
    public foodCategory: FoodCategory;

    getLanguageEnum(): LanguageEnum {
        return languageHelper.getLanguage(this.language);
    }

    getKj(): number {
        if (!this.kcal) {
            return 0;
        }

        return 4.184 * this.kcal;
    }
}
