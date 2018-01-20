import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuardService } from '../../../lib/auth';
import { UrlConfig } from '../../config';
import { AdminLayoutComponent } from '../../layouts/admin-layout.component';
import { EditDietPageComponent } from './edit/edit-diet-page.component';
import { EditDietPlanPageComponent } from './edit/edit-diet-plan-page.component';
import { ClientDietsPageComponent } from './list/client-diets-page.component';
import { DietPlanViewPageComponent } from './view/diet-plan-view-page.component';
import { DietTemplatesPageComponent } from './list/diet-templates-page.component';
import { NewDietTemplatePageComponent } from './new/new-diet-template-page.component';

@NgModule({
    declarations: [
    ],
    imports: [
        RouterModule.forChild([
            {
                path: UrlConfig.TrainerMasterPath, component: AdminLayoutComponent, canActivate: [AuthGuardService], children: [
                    {
                        path: 'diets', component: DietTemplatesPageComponent
                    },
                    {
                        path: 'diets/client-diets', component: ClientDietsPageComponent
                    },
                    {
                        path: 'diets/new', component: NewDietTemplatePageComponent
                    },
                    {
                        path: 'diets/edit/:id', component: EditDietPageComponent
                    },
                    {
                        path: 'diets/view/:id', component: DietPlanViewPageComponent
                    },
                    {
                        path: 'diets/edit-plan/:id', component: EditDietPlanPageComponent
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
