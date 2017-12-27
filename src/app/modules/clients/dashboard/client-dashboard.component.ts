import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { AppConfig } from '../../../config';
import { ComponentDependencyService, ComponentSetup } from '../../../core';
import { Appointment, ChatMessage, Diet, Workout } from '../../../models';
import { ClientsBaseComponent } from '../clients-base.component';
import { ClientMenuItems } from '../menu.items';
import { ListBoxItem, ListBoxConfig } from 'web-components/boxes';

@Component({
  templateUrl: 'client-dashboard.component.html'
})
export class ClientDashboardComponent extends ClientsBaseComponent implements OnInit {

  public readonly defaultAvatarUrl: string = AppConfig.DefaultUserAvatarUrl;
  public readonly googleApiKey: string = AppConfig.GoogleApiKey;

  public appointment?: Appointment;

  public chatMessagesListBox?: ListBoxConfig;
  public dietsListBox?: ListBoxConfig;
  public workoutsListBox?: ListBoxConfig;

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
    const dateNow = new Date();
    dateNow.setSeconds(0);
    dateNow.setMilliseconds(0);

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
