import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// core module
import { CoreModule } from '../../core';

// components
import { AllWorkoutsComponent } from './list/all-workouts.component';
import { WorkoutTemplatesComponent } from './list/workout-templates.component';
import { NewWorkoutComponent } from './new/new-workout.component';
import { EditWorkoutComponent } from './edit/edit-workout.component';
import { WorkoutPlanComponent } from './list/workout-plan.component';
import { EditWorkoutPlanComponent } from './edit/edit-workout-plan.component';

// dialogs
import { AddWorkoutExerciseDialogComponent} from './dialogs/add-workout-exercise-dialog.component';
import { SelectWorkoutExerciseDialogComponent} from './dialogs/select-workout-exercise-dialog.component';
import { EditWorkoutExerciseDialogComponent } from './dialogs/edit-workout-exercise-dialog.component';
import { AddCustomExerciseDialogComponent } from './dialogs/add-custom-exercise-dialog.component';

// exports
import { EditWorkoutPlanExportComponent } from './exports/edit-workout-plan-export.component';
import { EditWorkoutExportComponent } from './exports/edit-workout-export.component';

// router
import { WorkoutsRouter } from './workouts.routing';

// modules
import { SharedModule} from '../shared/shared.module';

@NgModule({
    imports: [
        CoreModule,
        CommonModule,
        WorkoutsRouter,
        SharedModule
    ],
    entryComponents:[
        AddCustomExerciseDialogComponent // has to be added here because its created by another dialog
    ],
    declarations: [
        AllWorkoutsComponent,
        WorkoutTemplatesComponent,
        NewWorkoutComponent,
        EditWorkoutComponent,
        WorkoutPlanComponent,
        AddWorkoutExerciseDialogComponent,
        EditWorkoutPlanComponent,
        SelectWorkoutExerciseDialogComponent,
        EditWorkoutExerciseDialogComponent,
        AddCustomExerciseDialogComponent,
        EditWorkoutPlanExportComponent,
        EditWorkoutExportComponent
    ],
    exports: [
        EditWorkoutPlanExportComponent,
        EditWorkoutExportComponent
    ]
})
export class WorkoutsModule { }