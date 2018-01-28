import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// pages core module
import { PagesCoreModule } from '../pages-core.module';

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

// router
import { ClientsRouter } from './clients.routing';

// modules
import { SharedModule} from '../../modules/shared/shared.module';
import { WorkoutsModule} from '../../modules/workouts/workouts.module';
import { DietsModule} from '../../modules/diets/diets.module';

@NgModule({
    imports: [
        PagesCoreModule,
        CommonModule,
        ClientsRouter,
        SharedModule,
        WorkoutsModule,
        DietsModule
    ],
    declarations: [
        // user
        ClientsOverviewPageComponent,
        NewClientPageComponent,
        EditClientPageComponent,
        // workout
        EditClientWorkoutPageComponent,
        ClientDietPreviewPageComponent,
        ClientWorkoutPageComponent,
        EditClientWorkoutPlanPageComponent,
        NewClientWorkoutPageComponent,
        // diet
        EditClientDietPageComponent,
        ClientDietPageComponent,
        EditClientDietPlanPageComponent,
        NewClientDietPageComponent,
        // progress
        EditClientProgressPageComponent,
        // stats
        StatsMainPageComponent,
        // chat
        ClientChatPageComponent,
        // gallery
        UserGalleryPageComponent,
        // appointment
        EditClientAppointmentPageComponent,
        ClientAppointmentListPageComponent,
        NewClientAppointmentPageComponent,
        ViewClientAppointmentPageComponent,
        // dashboard
        ClientDashboardPageComponent
    ]
    
})
export class ClientsPagesModule { }
