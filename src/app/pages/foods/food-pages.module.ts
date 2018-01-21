import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PagesCoreModule } from '../pages-core.module';
import { EditFoodPageComponent } from './edit/edit-food-page.component';
import { EditMealPageComponent } from './edit/edit-meal-page.component';
import { FoodsRouter } from './foods.routing';
import { AllFoodsListPageComponent } from './list/all-foods-list-page.component';
import { MyFoodsListPageComponent } from './list/my-foods-list-page.component';
import { MyMealsListPageComponent } from './list/my-meals-list-page.component';
import { NewFoodPageComponent } from './new/new-food-page.component';
import { NewMealPageComponent } from './new/new-meal-page.component';
import { PreviewFoodPageComponent } from './view/preview-food-page.component';
import { PreviewMealPageComponent } from './view/preview-meal-page.component';
import { MySupplementsListPageComponent } from './list/my-supplements-list-page.component';
import { NewSupplementPageComponent } from './new/new-supplement-page.component';
import { PreviewSupplementPageComponent } from './view/preview-supplement-page.component';
import { EditSupplementPageComponent } from './edit/edit-supplement-page.component';

@NgModule({
    imports: [
        PagesCoreModule,
        CommonModule,
        FoodsRouter,
    ],
    declarations: [
        EditFoodPageComponent,
        AllFoodsListPageComponent,
        MyMealsListPageComponent,
        MyMealsListPageComponent,
        MyFoodsListPageComponent,
        NewFoodPageComponent,
        PreviewFoodPageComponent,
        NewMealPageComponent,
        EditMealPageComponent,
        PreviewMealPageComponent,
        MySupplementsListPageComponent,
        NewSupplementPageComponent,
        PreviewSupplementPageComponent,
        EditSupplementPageComponent
    ],
})
export class FoodPagesModule { }
