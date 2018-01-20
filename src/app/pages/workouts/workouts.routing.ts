import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuardService } from '../../../lib/auth';
import { UrlConfig } from '../../config';
import { AdminLayoutComponent } from '../../layouts/admin-layout.component';
import { EditWorkoutPageComponent } from './edit/edit-workout-page.component';
import { EditWorkoutPlanPageComponent } from './edit/edit-workout-plan-page.component';
import { ClientWorkoutsPageComponent } from './list/client-workouts-page.component';
import { WorkoutTemplatesPageComponent } from './list/workout-templates-page.component';
import { NewWorkoutPageComponent } from './new/new-workout-page.component';
import { ViewWorkoutPlanPageComponent } from './view/view-workout-plan-page.component';

@NgModule({
    declarations: [
    ],
    imports: [
        RouterModule.forChild([
            {
                path: UrlConfig.TrainerMasterPath, component: AdminLayoutComponent, canActivate: [AuthGuardService], children: [
                    {
                        path: 'workouts', component: WorkoutTemplatesPageComponent
                    },
                    {
                        path: 'workouts/client-workouts', component: ClientWorkoutsPageComponent
                    },
                    {
                        path: 'workouts/new', component: NewWorkoutPageComponent
                    },
                    {
                        path: 'workouts/edit/:id', component: EditWorkoutPageComponent
                    },
                    {
                        path: 'workouts/view/:id', component: ViewWorkoutPlanPageComponent
                    },
                    {
                        path: 'workouts/edit-plan/:id', component: EditWorkoutPlanPageComponent
                    }
                ],
            },
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class WorkoutsRouter { }
