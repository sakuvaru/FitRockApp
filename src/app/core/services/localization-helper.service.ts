import { Injectable } from '@angular/core';
import { LocalizationService } from 'lib/localization';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class LocalizationHelperService {

  constructor(
    private localizationService: LocalizationService
  ) { }

  translateFoodAmountAndUnit(amount: number, foodUnit: string): Observable<string> {
    // first translate food unit in proper format
    let foodUnitTranslationString: string = 'module.foodUnits.pluralFive.' + foodUnit;

    amount = +amount;

    // prepare translation params
    const translateParams: any = {
      amount: amount,
    };
    if (amount === 0) {
      foodUnitTranslationString = 'module.foodUnits.pluralFive.' + foodUnit;
    }  
    
    if (amount === 1) {
      foodUnitTranslationString = 'module.foodUnits.' + foodUnit;
    } 
    
    if (amount >= 2 && amount < 5) {
      foodUnitTranslationString = 'module.foodUnits.pluralTwo.' + foodUnit;
    }

    return this.localizationService.get(foodUnitTranslationString)
      .flatMap(foodUnitTranslation => {
        // set translated food unit
        translateParams.foodUnit = foodUnitTranslation;

        return this.localizationService.get('module.foods.foodAmountTextLineA', translateParams);
      });
  }

  translateFoodComposition(proteins?: number, fats?: number, carbs?: number, kcal?: number): Observable<string> {
    // prepare translation params
    const translateParams: any = {
      proteins: proteins,
      fats: fats,
      carbs: carbs,
      kcal: kcal
    };

    return this.localizationService.get('module.foods.foodAmountTextLineB', translateParams);
  }

  translateFoodAmountComplete(amount: number, foodUnit: string, proteins?: number, fats?: number, carbs?: number, kcal?: number): Observable<string> {
    // first translate food unit in proper format
    let foodUnitTranslationString: string = '';

    // prepare translation params
    const translateParams: any = {
      amount: amount,
      proteins: proteins,
      fats: fats,
      carbs: carbs,
      kcal: kcal
    };

    if (amount === 0) {
      foodUnitTranslationString = 'module.foodUnits.pluralFive.' + foodUnit;
    } else if (amount === 1) {
      foodUnitTranslationString = 'module.foodUnits.' + foodUnit;
    } else if (amount >= 2 && amount < 5) {
      foodUnitTranslationString = 'module.foodUnits.pluralTwo.' + foodUnit;
    } else if (amount >= 5) {
      foodUnitTranslationString = 'module.foodUnits.pluralFive.' + foodUnit;
    }

    return this.localizationService.get(foodUnitTranslationString)
      .flatMap(foodUnitTranslation => {
        // set translated food unit
        translateParams.foodUnit = foodUnitTranslation;

        return this.localizationService.get('module.foods.foodAmountTextComplete', translateParams);
      });
  }
}

