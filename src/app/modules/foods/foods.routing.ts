import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuardService } from '../../../lib/auth';
import { UrlConfig } from '../../config';
import { AdminLayoutComponent } from '../../layouts/admin-layout.component';
import { EditFoodComponent } from './edit/edit-food.component';
import { AllFoodsListComponent } from './list/all-foods-list.component';
import { MyMealsListComponent } from './list/my-meals-list.component';
import { MyFoodsListComponent } from './list/my-foods-list.component';
import { NewFoodComponent } from './new/new-food.component';
import { PreviewFoodComponent } from './view/preview-food.component';
import { NewMealComponent } from './new/new-meal.component';
import { EditMealComponent } from './edit/edit-meal.component';
import { PreviewMealComponent } from './view/preview-meal.component';

@NgModule({
    declarations: [
    ],
    imports: [
        RouterModule.forChild([
            {
                path: UrlConfig.TrainerMasterPath, component: AdminLayoutComponent, canActivate: [AuthGuardService], children: [
                    {
                        path: 'foods', component: MyFoodsListComponent
                    },
                    {
                        path: 'foods/all', component: AllFoodsListComponent
                    },
                    {
                        path: 'foods/new', component: NewFoodComponent
                    },
                    {
                        path: 'foods/edit/:id', component: EditFoodComponent
                    },
                    {
                        path: 'foods/preview/:id', component: PreviewFoodComponent
                    },
                    {
                        path: 'foods/meals', component: MyMealsListComponent
                    },
                    {
                        path: 'foods/meals/preview/:id', component: PreviewMealComponent
                    },
                    {
                        path: 'foods/meals/new', component: NewMealComponent
                    },
                    {
                        path: 'foods/meals/edit/:id', component: EditMealComponent
                    }
                ],
            },
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class FoodsRouter { }
