import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// guard
import { AuthGuardService } from '../../../lib/auth';

// config
import { UrlConfig } from '../../core';

// layouts
import { SimpleLayoutComponent } from '../../layouts/simple-layout.component';
import { AdminLayoutComponent } from '../../layouts/admin-layout.component';

// user components
import { ClientsOverviewComponent } from './client/list/clients-overview.component';
import { NewClientComponent } from './client/new/new-client.component';
import { EditClientComponent } from './client/edit/edit-client.component';

// workout components
import { EditClientWorkoutComponent } from './workout/edit/edit-client-workout.component';
import { ClientWorkoutComponent } from './workout/edit/client-workout.component';
import { EditClientWorkoutPlanComponent } from './workout/edit/edit-client-workout-plan.component';
import { NewClientWorkoutComponent } from './workout/new/new-client-workout.component';

// diet components
import { EditClientDietComponent } from './diet/edit/edit-client-diet.component';
import { ClientDietComponent } from './diet/edit/client-diet.component';
import { EditClientDietPlanComponent } from './diet/edit/edit-client-diet-plan.component';
import { NewClientDietComponent } from './diet/new/new-client-diet.component';

// progress components
import { EditClientProgressComponent } from './progress/edit/edit-client-progress.component';

// stats components
import { StatsMainComponent } from './stats/stats-main.component';

// chat components
import { ClientChatComponent } from './chat/client-chat.component';

// gallery
import { UserGalleryComponent } from './gallery/user-gallery.component';

const routes: Routes = [
    {
        path: UrlConfig.TrainerMasterPath, component: AdminLayoutComponent, canActivate: [AuthGuardService], children: [
            // user
            {
                path: 'clients', component: ClientsOverviewComponent
            },
            {
                path: 'clients/new', component: NewClientComponent
            },
            {
                path: 'clients/edit/:id', component: EditClientComponent
            },
            // workout
            {
                path: 'clients/edit/:id/workout', component: ClientWorkoutComponent
            },
            {
                path: 'clients/edit/:id/workout/:workoutId', component: EditClientWorkoutComponent
            },
            {
                path: 'clients/edit/:id/workout/:workoutId/workout-plan', component: EditClientWorkoutPlanComponent
            },
            {
                path: 'clients/edit/:id/new-workout', component: NewClientWorkoutComponent
            },
            // diet
            {
                path: 'clients/edit/:id/diet', component: ClientDietComponent
            },
            {
                path: 'clients/edit/:id/diet/:dietId', component: EditClientDietComponent
            },
            {
                path: 'clients/edit/:id/diet/:dietId/diet-plan', component: EditClientDietPlanComponent
            },
            {
                path: 'clients/edit/:id/new-diet', component: NewClientDietComponent
            },
            // progress
            {
                path: 'clients/edit/:id/progress', component: EditClientProgressComponent
            },
            // stats
            {
                 path: 'clients/edit/:id/stats', component: StatsMainComponent
            },
            // chat
            {
                path: 'clients/edit/:id/chat', component: ClientChatComponent
            },
            // gallery
            {
                path: 'clients/edit/:id/gallery', component: UserGalleryComponent
            },
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
export class ClientsRouter { }
