// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { Observable } from 'rxjs/Rx';
import { ClientsBaseComponent } from '../clients-base.component';
import { ClientMenuItems } from '../menu.items';
import { User, Appointment, Workout, Diet, ChatMessage } from '../../../models';

@Component({
  templateUrl: 'client-dashboard.component.html'
})
export class ClientDashboardComponent extends ClientsBaseComponent implements OnInit {

  public readonly defaultAvatarUrl: string = AppConfig.DefaultUserAvatarUrl;
  public readonly googleApiKey: string = AppConfig.GoogleApiKey;

  public appointment?: Appointment;
  public workouts?: Workout[];
  public  diets?: Diet[];
  public chatMessages?: ChatMessage[];

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected componentDependencyService: ComponentDependencyService,
  ) {
    super(componentDependencyService, activatedRoute);
  }

  setup(): ComponentSetup | null {
    return {
      initialized: false
    };
  }

  ngOnInit(): void {
    super.ngOnInit();

    super.subscribeToObservables(this.getComponentObservables());
    super.initClientSubscriptions();
  }

  private getComponentObservables(): Observable<any>[] {
    const observables: Observable<any>[] = [];
    observables.push(this.getInitMenuObservable());
    observables.push(this.getInitAppointmentObservable());
    observables.push(this.getInitWorkoutsObservable());
    observables.push(this.getInitDietsObservable());
    observables.push(this.getInitChatMessagesObservable());
    return observables;
  }

  private getInitWorkoutsObservable(): Observable<any> {
    return this.clientIdChange
      .switchMap(clientId => {
        return this.dependencies.itemServices.workoutService.items()
          .byCurrentUser()
          .whereEquals('ClientId', clientId)
          .orderByDesc('Id')
          .get();
      })
      .map(response => {
        this.workouts = response.items;
      });
  }

  private getInitDietsObservable(): Observable<any> {
    return this.clientIdChange
      .switchMap(clientId => {
        return this.dependencies.itemServices.dietService.items()
          .byCurrentUser()
          .whereEquals('ClientId', clientId)
          .orderByDesc('Id')
          .get();
      })
      .map(response => {
        this.diets = response.items;
      });
  }

  private getInitChatMessagesObservable(): Observable<any> {
    return this.clientIdChange
      .switchMap(clientId => {
        return this.dependencies.itemServices.chatMessageService.getConversationMessages(clientId)
          .limit(6)
          .orderByDesc('Id')
          .get();
      })
      .map(response => {
        this.chatMessages = response.items;
      });
  }

  private getInitAppointmentObservable(): Observable<any> {
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
  
  private getInitMenuObservable(): Observable<any> {
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
          menuAvatarUrl: client.avatarUrl
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
