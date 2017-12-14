import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// guard
import { AuthGuardService } from '../../../lib/auth';

// config
import { AppConfig, UrlConfig } from '../../config';

// shared templates
import { SimpleLayoutComponent } from '../../layouts/simple-layout.component';
import { AdminLayoutComponent } from '../../layouts/admin-layout.component';

// components
import { ClientDietsComponent } from './list/client-diets.component';
import { DietTemplatesComponent } from './list/diet-templates.component';
import { NewDietTemplateComponent } from './new/new-diet-template.component';
import { EditDietComponent } from './edit/edit-diet.component';
import { DietPlanComponent } from './list/diet-plan.component';
import { EditDietPlanComponent } from './edit/edit-diet-plan.component';

// dialogs
import { AddDietFoodDialogComponent } from './dialogs/add-diet-food-dialog.component';
import { SelectDietFoodDialogComponent } from './dialogs/select-diet-food-dialog.component';
import { EditDietFoodDialogComponent } from './dialogs/edit-diet-food-dialog.component';
import { AddCustomFoodDialogComponent } from './dialogs/add-custom-food-dialog.component';

@NgModule({
    declarations: [
    ],
    imports: [
        RouterModule.forChild([
            {
                // workouts
                path: UrlConfig.TrainerMasterPath, component: AdminLayoutComponent, canActivate: [AuthGuardService], children: [
                    {
                        path: 'diets', component: DietTemplatesComponent
                    },
                    {
                        path: 'diets/client-diets', component: ClientDietsComponent
                    },
                    {
                        path: 'diets/new', component: NewDietTemplateComponent
                    },
                    {
                        path: 'diets/edit/:id', component: EditDietComponent
                    },
                    {
                        path: 'diets/view/:id', component: DietPlanComponent
                    },
                    {
                        path: 'diets/edit-plan/:id', component: EditDietPlanComponent
                    },
                ],
            },
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class DietsRouter { }
