import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuardService } from '../../../lib/auth';
import { UrlConfig } from '../../config';
import { AdminLayoutComponent } from '../../layouts/admin-layout.component';
import { EditFoodComponent } from './edit/edit-food.component';
import { AllFoodsListComponent } from './list/all-foods-list.component';
import { MyDishesListComponent } from './list/my-dishes-list.component';
import { MyFoodsListComponent } from './list/my-foods-list.component';
import { NewFoodComponent } from './new/new-food.component';
import { PreviewFoodComponent } from './view/preview-food.component';
import { NewDishComponent } from './new/new-dish.component';
import { EditDishComponent } from './edit/edit-dish.component';

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
                        path: 'foods/dishes', component: MyDishesListComponent
                    },
                    {
                        path: 'foods/dishes/new', component: NewDishComponent
                    },
                    {
                        path: 'foods/dishes/edit/:id', component: EditDishComponent
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
