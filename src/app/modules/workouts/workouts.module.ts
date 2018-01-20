import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CoreModule } from '../../core';
import { AddCustomExerciseDialogComponent } from './dialogs/add-custom-exercise-dialog.component';
import { AddWorkoutExerciseDialogComponent } from './dialogs/add-workout-exercise-dialog.component';
import { EditWorkoutExerciseDialogComponent } from './dialogs/edit-workout-exercise-dialog.component';
import { SelectWorkoutExerciseDialogComponent } from './dialogs/select-workout-exercise-dialog.component';
import { EditWorkoutPlanComponent } from './edit/edit-workout-plan.component';
import { EditWorkoutComponent } from './edit/edit-workout.component';
import { ClientWorkoutsComponent } from './list/client-workouts.component';
import { WorkoutTemplatesComponent } from './list/workout-templates.component';
import { NewWorkoutComponent } from './new/new-workout.component';
import { ViewWorkoutPlanComponent } from './view/view-workout-plan.component';

@NgModule({
    imports: [
        CoreModule,
        CommonModule,
    ],
    entryComponents: [
        AddCustomExerciseDialogComponent,
        EditWorkoutExerciseDialogComponent,
        SelectWorkoutExerciseDialogComponent,
        EditWorkoutExerciseDialogComponent,
        AddCustomExerciseDialogComponent,
        AddWorkoutExerciseDialogComponent
    ],
    declarations: [
        ClientWorkoutsComponent,
        WorkoutTemplatesComponent,
        NewWorkoutComponent,
        EditWorkoutComponent,
        ViewWorkoutPlanComponent,
        AddWorkoutExerciseDialogComponent,
        EditWorkoutPlanComponent,
        SelectWorkoutExerciseDialogComponent,
        EditWorkoutExerciseDialogComponent,
        AddCustomExerciseDialogComponent,
    ],
    exports: [
        ClientWorkoutsComponent,
        WorkoutTemplatesComponent,
        NewWorkoutComponent,
        EditWorkoutComponent,
        ViewWorkoutPlanComponent,
        AddWorkoutExerciseDialogComponent,
        EditWorkoutPlanComponent,
        SelectWorkoutExerciseDialogComponent,
        EditWorkoutExerciseDialogComponent,
        AddCustomExerciseDialogComponent,
    ]
})
export class WorkoutsModule { }
