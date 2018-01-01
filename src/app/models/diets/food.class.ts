import { BaseItem, LanguageEnum, languageHelper } from '../../../lib/repository';
import { FoodUnit } from './food-unit.class';
import { FoodCategory } from './food-category.class';
import { DietFood } from './diet-food.class';

export class Food extends BaseItem {
    public foodName: string;
    public foodCategoryId: number;
    public foodUnitId: number;
    public foodUnitMeasurementValue: number;
    public isGlobal: boolean;
    public isApproved: boolean;
    public description: string;
    public kcal?: number;
    public fat?: number;
    public cho?: number;
    public prot?: number;
    public sugar?: number;
    public nacl?: number;
    public language: LanguageEnum;
    public IsDishFood: boolean;

    public dishFoods: DietFood[];
    public foodUnit: FoodUnit;
    public foodCategory: FoodCategory;

    getLanguageEnum(): LanguageEnum {
        return languageHelper.getLanguage(this.language);
    }
}
