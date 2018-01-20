import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CoreModule } from '../../core';
import { SharedModule } from '../shared/shared.module';
import { AddDietFoodDialogComponent } from './dialogs/add-diet-food-dialog.component';
import { AddNewDishDialogComponent } from './dialogs/add-new-dish-dialog.component';
import { AddNewFoodDialogComponent } from './dialogs/add-new-food-dialog.component';
import { EditDietFoodDialogComponent } from './dialogs/edit-diet-food-dialog.component';
import { SelectDietFoodDialogComponent } from './dialogs/select-diet-food-dialog.component';
import { EditDietPlanComponent } from './edit/edit-diet-plan.component';
import { EditDietComponent } from './edit/edit-diet.component';
import { ClientDietsComponent } from './list/client-diets.component';
import { DietTemplatesComponent } from './list/diet-templates.component';
import { NewDietTemplateComponent } from './new/new-diet-template.component';
import { DietPlanViewComponent } from './view/diet-plan-view.component';

@NgModule({
    imports: [
        CoreModule,
        CommonModule,
        SharedModule
    ],
    entryComponents: [
        AddDietFoodDialogComponent,
        SelectDietFoodDialogComponent,
        EditDietFoodDialogComponent,
        AddNewFoodDialogComponent,
        AddNewDishDialogComponent
    ],
    declarations: [
        ClientDietsComponent,
        DietTemplatesComponent,
        NewDietTemplateComponent,
        EditDietComponent,
        DietPlanViewComponent,
        EditDietPlanComponent,
        AddDietFoodDialogComponent,
        SelectDietFoodDialogComponent,
        EditDietFoodDialogComponent,
        AddNewFoodDialogComponent,
        AddNewDishDialogComponent,
    ],
    exports: [
        ClientDietsComponent,
        DietTemplatesComponent,
        NewDietTemplateComponent,
        EditDietComponent,
        DietPlanViewComponent,
        EditDietPlanComponent,
        AddDietFoodDialogComponent,
        SelectDietFoodDialogComponent,
        EditDietFoodDialogComponent,
        AddNewFoodDialogComponent,
        AddNewDishDialogComponent,
    ]
})
export class DietsModule { }
