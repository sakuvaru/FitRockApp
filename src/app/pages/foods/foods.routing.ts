import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuardService } from '../../../lib/auth';
import { UrlConfig } from '../../config';
import { AdminLayoutComponent } from '../../layouts/admin-layout.component';
import { EditFoodPageComponent } from './edit/edit-food-page.component';
import { EditMealPageComponent } from './edit/edit-meal-page.component';
import { AllFoodsListPageComponent } from './list/all-foods-list-page.component';
import { MyFoodsListPageComponent } from './list/my-foods-list-page.component';
import { MyMealsListPageComponent } from './list/my-meals-list-page.component';
import { NewFoodPageComponent } from './new/new-food-page.component';
import { NewMealPageComponent } from './new/new-meal-page.component';
import { PreviewFoodPageComponent } from './view/preview-food-page.component';
import { PreviewMealPageComponent } from './view/preview-meal-page.component';

@NgModule({
    declarations: [
    ],
    imports: [
        RouterModule.forChild([
            {
                path: UrlConfig.TrainerMasterPath, component: AdminLayoutComponent, canActivate: [AuthGuardService], children: [
                    {
                        path: 'foods', component: MyFoodsListPageComponent
                    },
                    {
                        path: 'foods/all', component: AllFoodsListPageComponent
                    },
                    {
                        path: 'foods/new', component: NewFoodPageComponent
                    },
                    {
                        path: 'foods/edit/:id', component: EditFoodPageComponent
                    },
                    {
                        path: 'foods/preview/:id', component: PreviewFoodPageComponent
                    },
                    {
                        path: 'foods/meals', component: MyMealsListPageComponent
                    },
                    {
                        path: 'foods/meals/preview/:id', component: PreviewMealPageComponent
                    },
                    {
                        path: 'foods/meals/new', component: NewMealPageComponent
                    },
                    {
                        path: 'foods/meals/edit/:id', component: EditMealPageComponent
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
