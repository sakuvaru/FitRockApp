import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// core module
import { CoreModule } from '../../core';

// components
import { WorkoutsOverviewComponent } from './list/workouts-overview.component';
import { NewWorkoutComponent } from './new/new-workout.component';
import { EditWorkoutComponent } from './edit/edit-workout.component';
import { WorkoutPlanComponent } from './list/workout-plan.component';
import { EditWorkoutPlanComponent } from './edit/edit-workout-plan.component';

import { AddWorkoutExerciseDialogComponent} from './dialogs/add-workout-exercise-dialog.component';
import { SelectWorkoutExerciseDialogComponent} from './dialogs/select-workout-exercise-dialog.component';
import { EditWorkoutExerciseDialogComponent } from './dialogs/edit-workout-exercise-dialog.component';

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
    declarations: [
        WorkoutsOverviewComponent,
        NewWorkoutComponent,
        EditWorkoutComponent,
        WorkoutPlanComponent,
        AddWorkoutExerciseDialogComponent,
        EditWorkoutPlanComponent,
        SelectWorkoutExerciseDialogComponent,
        EditWorkoutExerciseDialogComponent
    ]
})
export class WorkoutsModule { }