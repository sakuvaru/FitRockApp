import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { InfoBoxConfig, InfoBoxLine, InfoBoxLineType, ListBoxConfig, ListBoxItem, MapBoxConfig } from 'web-components/boxes';

import { AppConfig } from '../../../config';
import { ComponentDependencyService, ComponentSetup } from '../../../core';
import { Appointment, Diet, Workout } from '../../../models';
import { ClientsBaseComponent } from '../clients-base.component';
import { ClientMenuItems } from '../menu.items';

@Component({
  templateUrl: 'client-dashboard.component.html'
})
export class ClientDashboardComponent extends ClientsBaseComponent implements OnInit {

  public readonly defaultAvatarUrl: string = AppConfig.DefaultUserAvatarUrl;
  public readonly googleApiKey: string = AppConfig.GoogleApiKey;

  public appointment?: Appointment;

  public appointmentInfoBox?: InfoBoxConfig;

  public chatMessagesListBox?: ListBoxConfig;
  public dietsListBox?: ListBoxConfig;
  public workoutsListBox?: ListBoxConfig;
  public appointmentMapBox?: MapBoxConfig;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected componentDependencyService: ComponentDependencyService,
  ) {
    super(componentDependencyService, activatedRoute);
  }

  setup(): ComponentSetup {
    return new ComponentSetup({
        initialized: false,
        isNested: false
    });
}

  ngOnInit(): void {
    super.ngOnInit();

    super.subscribeToObservables(this.getComponentObservables());
    super.initClientSubscriptions();
  }

  private getComponentObservables(): Observable<void>[] {
    const observables: Observable<any>[] = [];
    observables.push(this.getInitMenuObservable());
    observables.push(this.getInitAppointmentObservable());
    observables.push(this.getInitWorkoutsObservable());
    observables.push(this.getInitDietsObservable());
    observables.push(this.getInitChatMessagesObservable());
    return observables;
  }

  private getInitWorkoutsObservable(): Observable<void> {
    return this.clientIdChange
    .map(clientId => {
      this.workoutsListBox = new ListBoxConfig(
        this.dependencies.itemServices.workoutService.items()
          .byCurrentUser()
          .whereEquals('ClientId', clientId)
          .orderByDesc('Id')
          .get()
        .map(response => {
          return response.items.map(item => new ListBoxItem(
            item.workoutName,
            this.getWorkoutUrl(item),
          ));
        }),
        super.translate('module.clients.dashboard.workouts'),
        {
          noDataMessage: super.translate('module.clients.dashboard.noWorkouts')
        }
      );
    });
  }

  private getInitDietsObservable(): Observable<void> {
    return this.clientIdChange
    .map(clientId => {
      this.dietsListBox = new ListBoxConfig(
        this.dependencies.itemServices.dietService.items()
          .byCurrentUser()
          .whereEquals('ClientId', clientId)
          .orderByDesc('Id')
          .get()
        .map(response => {
          return response.items.map(item => new ListBoxItem(
            item.dietName,
            this.getDietUrl(item),
          ));
        }),
        super.translate('module.clients.dashboard.diets'),
        {
          noDataMessage: super.translate('module.clients.dashboard.noDiets')
        }
      );
    });
  }

  private getInitChatMessagesObservable(): Observable<void> {
    return this.clientIdChange
      .map(clientId => {
        this.chatMessagesListBox = new ListBoxConfig(
          this.dependencies.itemServices.chatMessageService.getConversationMessages(clientId)
          .limit(6)
          .orderByDesc('Id')
          .get()
          .map(response => {
            return response.items.map(item => new ListBoxItem(
              item.message,
              this.getChatMessageUrl(),
              item.sender.getAvatarOrGravatarUrl() ? item.sender.getAvatarOrGravatarUrl() : this.defaultAvatarUrl
            ));
          }),
          super.translate('module.clients.dashboard.latestMessages'),
          {
            noDataMessage: super.translate('module.clients.dashboard.noChatMessages'),          }
        );
      });
  }

  private getInitAppointmentObservable(): Observable<void> {
    return this.clientIdChange
    .map(clientId => {
      const dateNow = new Date();
      dateNow.setSeconds(0);
      dateNow.setMilliseconds(0);

      this.appointmentInfoBox = new InfoBoxConfig(
        this.dependencies.itemServices.appointmentService.items()
        .limit(1)
        .byCurrentUser()
        .whereEquals('ClientId', clientId)
        .whereGreaterThan('AppointmentDate', dateNow)
        .orderByAsc('AppointmentDate')
        .includeMultiple(['Workout', 'Location', 'Client'])
        .get()
        .map(response => {
          const appointment = response.firstItem();
          if (!appointment) {
            return [];
          }

          // also init map
          this.appointmentMapBox = new MapBoxConfig(
            super.translate('module.clients.dashboard.nextAppointmentMap'),
            this.googleApiKey,
            appointment.location.address,
            appointment.location.lat,
            appointment.location.lng,
            {
              zoom: 10
            }
          );

          const lines: InfoBoxLine[] = [
            new InfoBoxLine(super.formatDate(appointment.appointmentDate), InfoBoxLineType.Title),
            new InfoBoxLine(appointment.client.getFullName(), InfoBoxLineType.Body2),
            new InfoBoxLine(appointment.location.address, InfoBoxLineType.Body1)
          ];

          const workout = appointment.workout;
          if (workout) {
            lines.push(new InfoBoxLine(super.translate('module.clients.appointments.workout').map(notes => notes + ': ' + workout.workoutName), InfoBoxLineType.Body1));
          }

          if (appointment.notes) {
            lines.push(new InfoBoxLine(super.translate('module.clients.appointments.notes').map(notes => notes + ': ' + appointment.notes), InfoBoxLineType.Caption));
          }

          return lines;

        }),
        super.translate('module.clients.dashboard.nextAppointment'),
        {
          noDataMessage: super.translate('module.clients.dashboard.noAppointment')
        }
      );
        
    });

    /*
    return this.clientIdChange
      .switchMap(clientId => {
        return this.dependencies.itemServices.appointmentService.items()
          .limit(1)
          .byCurrentUser()
          .whereEquals('ClientId', clientId)
          .whereGreaterThan('AppointmentDate', dateNow)
          .orderByAsc('AppointmentDate')
          .includeMultiple(['Workout', 'Location'])
          .get();
      })
      .map(response => {
        this.appointment = response.firstItem();
      });
      */
  }
  
  private getInitMenuObservable(): Observable<void> {
    return this.clientChange
      .map(client => {
        this.setConfig({
          menuItems: new ClientMenuItems(client.id).menuItems,
          menuTitle: {
            key: 'module.clients.viewClientSubtitle',
            data: { 'fullName': client.getFullName() }
          },
          componentTitle: {
            'key': 'module.clients.submenu.dashboard'
          },
          menuAvatarUrl: client.getAvatarOrGravatarUrl()
        });
      });
  }

  private getDietUrl(diet: Diet): string {
    return super.getTrainerUrl('clients//edit/' + this.clientId + '/diet/' + diet.id + '/diet-plan');
  }

  private getWorkoutUrl(workout: Workout): string {
    return super.getTrainerUrl('clients/edit/' + this.clientId + '/workout/' + workout.id + '/workout-plan');
  }
  
  private getAppointmentUrl(appointment: Appointment): string {
    return super.getTrainerUrl('clients/edit/' + this.clientId + '/appointments/view/' + appointment.id);
  }

  private getChatMessageUrl(): string {
    return super.getTrainerUrl('clients/edit/' + this.clientId + '/chat');
  }
}
