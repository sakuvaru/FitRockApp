import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// core module
import { CoreModule } from '../../core';

// components
import { ClientDietsComponent } from './list/client-diets.component';
import { DietTemplatesComponent } from './list/diet-templates.component';
import { NewDietTemplateComponent } from './new/new-diet-template.component';
import { EditDietComponent } from './edit/edit-diet.component';
import { DietPlanComponent } from './list/diet-plan.component';
import { EditDietPlan } from './edit/edit-diet-plan.component';

// dialogs
import { AddDietFoodDialogComponent} from './dialogs/add-diet-food-dialog.component';
import { SelectDietFoodDialogComponent} from './dialogs/select-diet-food-dialog.component';
import { EditDietFoodDialogComponent } from './dialogs/edit-diet-food-dialog.component';
import { AddCustomFoodDialogComponent } from './dialogs/add-custom-food-dialog.component';

// exports
import { EditDietPlanExportComponent } from './exports/edit-diet-plan-export.component';
import { EditDietExportComponent } from './exports/edit-diet-export.component';

// router
import { DietsRouter } from './diets.routing';

// modules
import { SharedModule} from '../shared/shared.module';

@NgModule({
    imports: [
        CoreModule,
        CommonModule,
        DietsRouter,
        SharedModule
    ],
    entryComponents:[
        AddCustomFoodDialogComponent, 
        AddDietFoodDialogComponent,
        SelectDietFoodDialogComponent,
        EditDietFoodDialogComponent,
        AddCustomFoodDialogComponent,
    ],
    declarations: [
        ClientDietsComponent,
        DietTemplatesComponent,
        NewDietTemplateComponent,
        EditDietComponent,
        DietPlanComponent,
        EditDietPlan,
        AddDietFoodDialogComponent,
        SelectDietFoodDialogComponent,
        EditDietFoodDialogComponent,
        AddCustomFoodDialogComponent,
        EditDietPlanExportComponent,
        EditDietExportComponent
    ],
    exports: [
        EditDietPlanExportComponent,
        EditDietExportComponent
    ]
})
export class DietsModule { }