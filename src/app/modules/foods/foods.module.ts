import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CoreModule } from '../../core';
import { SharedModule } from '../shared/shared.module';
import { EditFoodComponent } from './edit/edit-food.component';
import { FoodsRouter } from './foods.routing';
import { AllFoodsListComponent } from './list/all-foods-list.component';
import { MyDishesListComponent } from './list/my-dishes-list.component';
import { MyFoodsListComponent } from './list/my-foods-list.component';
import { NewFoodComponent } from './new/new-food.component';
import { PreviewFoodComponent } from './view/preview-food.component';
import { NewDishComponent } from './new/new-dish.component';
import { EditDishComponent } from './edit/edit-dish.component';
import { PreviewDishComponent } from './view/preview-dish.component';

@NgModule({
    imports: [
        CoreModule,
        CommonModule,
        FoodsRouter,
        SharedModule
    ],
    declarations: [
        MyFoodsListComponent,
        AllFoodsListComponent,
        EditFoodComponent,
        NewFoodComponent,
        PreviewFoodComponent,
        MyDishesListComponent,
        NewDishComponent,
        EditDishComponent,
        PreviewDishComponent
    ]
})
export class FoodsModule { }
