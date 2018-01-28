import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// guard
import { AuthGuardService } from '../../../lib/auth';

// config
import { AppConfig, UrlConfig } from '../../config';

// layouts
import { SimpleLayoutComponent } from '../../layouts/simple-layout.component';
import { AdminLayoutComponent } from '../../layouts/admin-layout.component';

// core module
import { CoreModule } from '../../core';

// user components
import { ClientsOverviewPageComponent } from './client/list/clients-overview-page.component';
import { NewClientPageComponent } from './client/new/new-client-page.component';
import { EditClientPageComponent } from './client/edit/edit-client-page.component';

// workout components
import { EditClientWorkoutPageComponent } from './workout/edit/edit-client-workout-page.component';
import { ClientWorkoutPageComponent } from './workout/edit/client-workout-page.component';
import { EditClientWorkoutPlanPageComponent } from './workout/edit/edit-client-workout-plan-page.component';
import { NewClientWorkoutPageComponent } from './workout/new/new-client-workout-page.component';

// diet components
import { EditClientDietPageComponent } from './diet/edit/edit-client-diet-page.component';
import { ClientDietPreviewPageComponent } from './diet/view/client-diet-preview-page.component';
import { ClientDietPageComponent } from './diet/edit/client-diet-page.component';
import { EditClientDietPlanPageComponent } from './diet/edit/edit-client-diet-plan-page.component';
import { NewClientDietPageComponent } from './diet/new/new-client-diet-page.component';

// progress components
import { EditClientProgressPageComponent } from './progress/edit/edit-client-progress.component';

// stats components
import { StatsMainPageComponent } from './stats/stats-main-page.component';

// chat components
import { ClientChatPageComponent } from './chat/client-chat-page.component';

// gallery
import { UserGalleryPageComponent } from './gallery/user-gallery-page.component';

// appointments
import { EditClientAppointmentPageComponent } from './appointment/edit/edit-client-appointment-page.component';
import { ClientAppointmentListPageComponent } from './appointment/list/client-appointment-list-page.component';
import { NewClientAppointmentPageComponent } from './appointment/new/new-client-appointment-page.component';
import { ViewClientAppointmentPageComponent } from './appointment/view/view-client-appointment-page.component';

// dashboard
import { ClientDashboardPageComponent } from './dashboard/client-dashboard-page.component';

@NgModule({
    declarations: [
    ],
    imports: [
        RouterModule.forChild([
            {
                path: UrlConfig.TrainerMasterPath, component: AdminLayoutComponent, canActivate: [AuthGuardService], children: [
                    // user
                    {
                        path: 'clients', component: ClientsOverviewPageComponent
                    },
                    {
                        path: 'clients/new', component: NewClientPageComponent
                    },
                    {
                        path: 'clients/edit/:id', component: EditClientPageComponent
                    },
                    // workout
                    {
                        path: 'clients/edit/:id/workout', component: ClientWorkoutPageComponent
                    },
                    {
                        path: 'clients/edit/:id/workout/:workoutId', component: EditClientWorkoutPageComponent
                    },
                    {
                        path: 'clients/edit/:id/workout/:workoutId/workout-plan', component: EditClientWorkoutPlanPageComponent
                    },
                    {
                        path: 'clients/edit/:id/new-workout', component: NewClientWorkoutPageComponent
                    },
                    // diet
                    {
                        path: 'clients/edit/:id/diet', component: ClientDietPageComponent
                    },
                    {
                        path: 'clients/edit/:id/diet/:dietId/view', component: ClientDietPreviewPageComponent
                    },
                    {
                        path: 'clients/edit/:id/diet/:dietId', component: EditClientDietPageComponent
                    },
                    {
                        path: 'clients/edit/:id/diet/:dietId/diet-plan', component: EditClientDietPlanPageComponent
                    },
                    {
                        path: 'clients/edit/:id/new-diet', component: NewClientDietPageComponent
                    },
                    // progress
                    {
                        path: 'clients/edit/:id/progress', component: EditClientProgressPageComponent
                    },
                    // stats
                    {
                        path: 'clients/edit/:id/stats', component: StatsMainPageComponent
                    },
                    // chat
                    {
                        path: 'clients/edit/:id/chat', component: ClientChatPageComponent
                    },
                    // gallery
                    {
                        path: 'clients/edit/:id/gallery', component: UserGalleryPageComponent
                    },
                    // appointment
                    {
                        path: 'clients/edit/:id/appointments', component: ClientAppointmentListPageComponent
                    },
                    {
                        path: 'clients/edit/:id/appointments/edit/:appointmentId', component: EditClientAppointmentPageComponent
                    },
                    {
                        path: 'clients/edit/:id/appointments/view/:appointmentId', component: ViewClientAppointmentPageComponent
                    },
                    {
                        path: 'clients/edit/:id/appointments/new', component: NewClientAppointmentPageComponent
                    },
                    // dashboard
                    {
                        path: 'clients/edit/:id/dashboard', component: ClientDashboardPageComponent
                    },
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ClientsRouter { }
