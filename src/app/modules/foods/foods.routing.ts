import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// guard
import { AuthGuardService } from '../../../lib/auth';

// config
import { UrlConfig } from '../../core';

// workouts
import { SimpleLayoutComponent } from '../../layouts/simple-layout.component';
import { AdminLayoutComponent } from '../../layouts/admin-layout.component';

// components
import { MyFoodsListComponent} from './list/my-foods-list.component';
import { AllFoodsListComponent } from './list/all-foods-list.component';
import { EditFoodCompoent } from './edit/edit-food.component';
import { NewFoodComponent } from './new/new-food.component';
import { PreviewFoodComponent } from './view/preview-food.component';

const routes: Routes = [
    {
        // workouts
        path: UrlConfig.TrainerMasterPath, component: AdminLayoutComponent, canActivate: [AuthGuardService], children: [
            {
                path: 'foods', component: MyFoodsListComponent
            },
            {
                path: 'foods/all', component: EditFoodCompoent
            },
            {
                path: 'foods/new', component: NewFoodComponent
            },
            {
                path: 'foods/edit/:id', component: EditFoodCompoent
            },
            {
                path: 'foods/preview/:id', component: PreviewFoodComponent
            }
        ],
    },
];

@NgModule({
    declarations: [
    ],
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class FoodsRouter { }