import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// guard
import { AuthGuardService } from '../../../lib/auth';

// config
import { UrlConfig } from '../../core';

// components
import { SimpleLayoutComponent } from '../../layouts/simple-layout.component';
import { AdminLayoutComponent } from '../../layouts/admin-layout.component';
import { WorkoutsOverviewComponent } from './list/workouts-overview.component';
import { NewWorkoutComponent } from './new/new-workout.component';
import { EditWorkoutComponent } from './edit/edit-workout.component';
import { WorkoutPlanComponent } from './list/workout-plan.component';
import { EditWorkoutPlanComponent } from './edit/edit-workout-plan.component';
import { AddWorkoutExerciseDialogComponent } from './dialogs/add-workout-exercise-dialog.component';
import { SelectWorkoutExerciseDialogComponent } from './dialogs/select-workout-exercise-dialog.component';
import { EditWorkoutExerciseDialogComponent } from './dialogs/edit-workout-exercise-dialog.component';

const routes: Routes = [
    {
        path: UrlConfig.TrainerMasterPath, component: AdminLayoutComponent, canActivate: [AuthGuardService], children: [
            {
                path: 'workouts', component: WorkoutsOverviewComponent
            },
            {
                path: 'workouts/new', component: NewWorkoutComponent
            },
            {
                path: 'workouts/edit/:id', component: EditWorkoutComponent
            },
            {
                path: 'workouts/view/:id', component: WorkoutPlanComponent
            },
            {
                path: 'workouts/edit-plan/:id', component: EditWorkoutPlanComponent
            },
            {
                path: 'workouts/dialogs/add-workout-exercise', component: AddWorkoutExerciseDialogComponent
            },
            {
                path: 'workouts/dialogs/select-workout-exercise', component: SelectWorkoutExerciseDialogComponent
            },
            {
                path: 'workouts/dialogs/edit-workout-exercise', component: EditWorkoutExerciseDialogComponent
            }
        ]
    }
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
export class WorkoutsRouter { }