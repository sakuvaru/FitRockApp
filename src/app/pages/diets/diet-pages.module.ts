import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PagesCoreModule } from '../pages-core.module';
import { DietsRouter } from './diets.routing';

import { ClientDietsPageComponent } from './list/client-diets-page.component';
import { DietTemplatesPageComponent } from './list/diet-templates-page.component';
import { NewDietTemplatePageComponent } from './new/new-diet-template-page.component';
import { EditDietPageComponent } from './edit/edit-diet-page.component';
import { DietPlanViewPageComponent } from './view/diet-plan-view-page.component';
import { EditDietPlanPageComponent } from './edit/edit-diet-plan-page.component';

@NgModule({
    imports: [
        PagesCoreModule,
        CommonModule,
        DietsRouter
    ],
    declarations: [
        ClientDietsPageComponent,
        DietTemplatesPageComponent,
        NewDietTemplatePageComponent,
        EditDietPageComponent,
        DietPlanViewPageComponent,
        EditDietPlanPageComponent
    ],
    exports: [
    ]
})
export class DietPagesModule { }
