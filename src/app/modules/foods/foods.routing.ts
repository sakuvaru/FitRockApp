import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// guard
import { AuthGuardService } from '../../../lib/auth';

// config
import { AppConfig, UrlConfig } from '../../config';

// workouts
import { SimpleLayoutComponent } from '../../layouts/simple-layout.component';
import { AdminLayoutComponent } from '../../layouts/admin-layout.component';

// components
import { MyFoodsListComponent } from './list/my-foods-list.component';
import { AllFoodsListComponent } from './list/all-foods-list.component';
import { EditFoodComponent } from './edit/edit-food.component';
import { NewFoodComponent } from './new/new-food.component';
import { PreviewFoodComponent } from './view/preview-food.component';

@NgModule({
    declarations: [
    ],
    imports: [
        RouterModule.forChild([
            {
                // workouts
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
