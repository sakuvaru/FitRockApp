import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuardService } from '../../../lib/auth';
import { UrlConfig } from '../../config';
import { AdminLayoutComponent } from '../../layouts/admin-layout.component';
import { EditDietPlanComponent } from './edit/edit-diet-plan.component';
import { EditDietComponent } from './edit/edit-diet.component';
import { ClientDietsComponent } from './list/client-diets.component';
import { DietPlanComponent } from './list/diet-plan.component';
import { DietTemplatesComponent } from './list/diet-templates.component';
import { NewDietTemplateComponent } from './new/new-diet-template.component';

@NgModule({
    declarations: [
    ],
    imports: [
        RouterModule.forChild([
            {
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
