import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CoreModule } from '../../core';
import { SharedModule } from '../shared/shared.module';
import { EditFoodDishDialogComponent } from './dialogs/edit-food-dish-dialog.component';
import { FoodDishAmountDialogComponent } from './dialogs/food-dish-amount.component';
import { SelectFoodDialogComponent } from './dialogs/select-food-dialog.component';
import { EditFoodComponent } from './edit/edit-food.component';
import { EditMealComponent } from './edit/edit-meal.component';
import { AllFoodsListComponent } from './list/all-foods-list.component';
import { MyFoodsListComponent } from './list/my-foods-list.component';
import { MyMealsListComponent } from './list/my-meals-list.component';
import { NewFoodComponent } from './new/new-food.component';
import { NewMealComponent } from './new/new-meal.component';
import { PreviewFoodComponent } from './view/preview-food.component';
import { PreviewMealComponent } from './view/preview-meal.component';
import { MySupplementsListComponent } from './list/my-supplements-list.component';
import { NewSupplementComponent } from './new/new-supplement.component';
import { PreviewSupplementComponent } from './view/preview-supplement.component';
import { EditSupplementComponent } from './edit/edit-supplement.component';

@NgModule({
    imports: [
        CoreModule,
        CommonModule,
        SharedModule
    ],
    entryComponents: [
        SelectFoodDialogComponent,
        EditFoodDishDialogComponent,
        FoodDishAmountDialogComponent
    ],
    declarations: [
        MyFoodsListComponent,
        AllFoodsListComponent,
        EditFoodComponent,
        NewFoodComponent,
        PreviewFoodComponent,
        MyMealsListComponent,
        NewMealComponent,
        EditMealComponent,
        PreviewMealComponent,
        SelectFoodDialogComponent,
        EditFoodDishDialogComponent,
        FoodDishAmountDialogComponent,
        MySupplementsListComponent,
        NewSupplementComponent,
        PreviewSupplementComponent,
        EditSupplementComponent
    ],
    exports: [
        MyFoodsListComponent,
        AllFoodsListComponent,
        EditFoodComponent,
        NewFoodComponent,
        PreviewFoodComponent,
        MyMealsListComponent,
        NewMealComponent,
        EditMealComponent,
        PreviewMealComponent,
        SelectFoodDialogComponent,
        EditFoodDishDialogComponent,
        FoodDishAmountDialogComponent,
        MySupplementsListComponent,
        NewSupplementComponent,
        PreviewSupplementComponent,
        EditSupplementComponent
    ]
})
export class FoodsModule { }
