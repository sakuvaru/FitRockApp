import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// core module
import { CoreModule } from '../../core';

// user components
import { ClientsOverviewComponent } from './client/list/clients-overview.component';
import { NewClientComponent } from './client/new/new-client.component';
import { EditClientComponent } from './client/edit/edit-client.component';

// workout components
import { EditClientWorkoutComponent } from './workout/edit/edit-client-workout.component';
import { ClientWorkoutComponent } from './workout/edit/client-workout.component';
import { EditClientWorkoutPlanComponent } from './workout/edit/edit-client-workout-plan.component';
import { NewClientWorkoutComponent } from './workout/new/new-client-workout.component';
import { WorkoutListDialogComponent } from './workout/dialogs/workout-list-dialog.component';

// diet components
import { EditClientDietComponent } from './diet/edit/edit-client-diet.component';
import { ViewClientDietComponent } from './diet/view/view-client-diet.component';
import { ClientDietComponent } from './diet/edit/client-diet.component';
import { EditClientDietPlanComponent } from './diet/edit/edit-client-diet-plan.component';
import { NewClientDietComponent } from './diet/new/new-client-diet.component';

// progress components
import { EditClientProgressComponent } from './progress/edit/edit-client-progress.component';
import { NewClientProgressItemTypeDialogComponent } from './progress/dialogs/new-client-progress-item-type-dialog.component';
import { EditProgressItemDialogComponent } from './progress/dialogs/edit-progress-item-dialog.component';
import { SelectProgressTypeDialogComponent } from './progress/dialogs/select-progress-type-dialog.component';

// stats components
import { UserStatsComponent } from './stats/user-stats.component';

// chat components
import { ClientChatComponent } from './chat/client-chat.component';

// gallery
import { UserGalleryComponent } from './gallery/user-gallery.component';

// appointments
import { EditClientAppointmentComponent } from './appointment/edit/edit-client-appointment.component';
import { ClientAppointmentListComponent } from './appointment/list/client-appointment-list.component';
import { NewClientAppointmentComponent } from './appointment/new/new-client-appointment.component';
import { ViewClientAppointmentComponent } from './appointment/view/view-client-appointment.component';

// dashboard
import { ClientDashboardComponent } from './dashboard/client-dashboard.component';

// modules
import { SharedModule} from '../shared/shared.module';
import { WorkoutsModule} from '../workouts/workouts.module';
import { DietsModule} from '../diets/diets.module';
import { ChatModule} from '../chat/chat.module';

@NgModule({
    imports: [
        CoreModule,
        CommonModule,
        SharedModule,
        WorkoutsModule,
        DietsModule,
        ChatModule
    ],
    entryComponents: [
        EditProgressItemDialogComponent,
        SelectProgressTypeDialogComponent,
        NewClientProgressItemTypeDialogComponent,
        WorkoutListDialogComponent
    ],
    exports: [
        // user
        ClientsOverviewComponent,
        NewClientComponent,
        EditClientComponent,
        // workout
        EditClientWorkoutComponent,
        ClientWorkoutComponent,
        EditClientWorkoutPlanComponent,
        NewClientWorkoutComponent,
        WorkoutListDialogComponent,
        // diet
        EditClientDietComponent,
        ViewClientDietComponent,
        ClientDietComponent,
        EditClientDietPlanComponent,
        NewClientDietComponent,
        // progress
        EditClientProgressComponent,
        NewClientProgressItemTypeDialogComponent,
        EditProgressItemDialogComponent,
        SelectProgressTypeDialogComponent,
        // stats
        UserStatsComponent,
        // chat
        ClientChatComponent,
        // gallery
        UserGalleryComponent,
        // appointment
        EditClientAppointmentComponent,
        ClientAppointmentListComponent,
        NewClientAppointmentComponent,
        ViewClientAppointmentComponent,
        // dashboard
        ClientDashboardComponent
    ],
    declarations: [
        // user
        ClientsOverviewComponent,
        NewClientComponent,
        EditClientComponent,
        // workout
        EditClientWorkoutComponent,
        ClientWorkoutComponent,
        EditClientWorkoutPlanComponent,
        NewClientWorkoutComponent,
        WorkoutListDialogComponent,
        // diet
        EditClientDietComponent,
        ViewClientDietComponent,
        ClientDietComponent,
        EditClientDietPlanComponent,
        NewClientDietComponent,
        // progress
        EditClientProgressComponent,
        NewClientProgressItemTypeDialogComponent,
        EditProgressItemDialogComponent,
        SelectProgressTypeDialogComponent,
        // stats
        UserStatsComponent,
        // chat
        ClientChatComponent,
        // gallery
        UserGalleryComponent,
        // appointment
        EditClientAppointmentComponent,
        ClientAppointmentListComponent,
        NewClientAppointmentComponent,
        ViewClientAppointmentComponent,
        // dashboard
        ClientDashboardComponent
    ]
    
})
export class ClientsModule { }
