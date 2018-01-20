import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PagesCoreModule } from '../pages-core.module';
import { EditWorkoutPageComponent } from './edit/edit-workout-page.component';
import { EditWorkoutPlanPageComponent } from './edit/edit-workout-plan-page.component';
import { ClientWorkoutsPageComponent } from './list/client-workouts-page.component';
import { WorkoutTemplatesPageComponent } from './list/workout-templates-page.component';
import { NewWorkoutPageComponent } from './new/new-workout-page.component';
import { ViewWorkoutPlanPageComponent } from './view/view-workout-plan-page.component';
import { WorkoutsRouter } from './workouts.routing';

@NgModule({
    imports: [
        PagesCoreModule,
        CommonModule,
        WorkoutsRouter,
    ],
    declarations: [
        ClientWorkoutsPageComponent,
        WorkoutTemplatesPageComponent,
        NewWorkoutPageComponent,
        EditWorkoutPageComponent,
        ViewWorkoutPlanPageComponent,
        EditWorkoutPlanPageComponent
    ]
})
export class WorkoutPagesModule { }
