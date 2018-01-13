import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CoreModule } from '../../core';
import { SharedModule } from '../shared/shared.module';
import { EditFoodComponent } from './edit/edit-food.component';
import { FoodsRouter } from './foods.routing';
import { AllFoodsListComponent } from './list/all-foods-list.component';
import { MyMealsListComponent } from './list/my-meals-list.component';
import { MyFoodsListComponent } from './list/my-foods-list.component';
import { NewFoodComponent } from './new/new-food.component';
import { PreviewFoodComponent } from './view/preview-food.component';
import { NewMealComponent } from './new/new-meal.component';
import { EditMealComponent } from './edit/edit-meal.component';
import { PreviewMealComponent } from './view/preview-meal.component';
import { SelectFoodDialogComponent } from './dialogs/select-food-dialog.component';
import { EditFoodDishDialogComponent } from './dialogs/edit-food-dish-dialog.component';
import { FoodDishAmountDialogComponent } from './dialogs/food-dish-amount.component';

@NgModule({
    imports: [
        CoreModule,
        CommonModule,
        FoodsRouter,
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
        FoodDishAmountDialogComponent
    ]
})
export class FoodsModule { }
