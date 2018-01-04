import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { ActionButton, InfoBoxConfig, InfoBoxLine, InfoBoxText, InfoBoxLineType, ListBoxConfig, ListBoxItem, MapBoxConfig } from 'web-components/boxes';

import { AppConfig, UrlConfig } from '../../../config';
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

  public appointmentInfoBox?: InfoBoxConfig;
  public chatMessagesListBox?: ListBoxConfig;
  public dietsListBox?: ListBoxConfig;
  public workoutsListBox?: ListBoxConfig;
  public appointmentMapBox?: MapBoxConfig;
  public privateNotesInfoBox?: InfoBoxConfig;
  public publicNotesInfoBox?: InfoBoxConfig;

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
                UrlConfig.getWorkoutUrl(item.client.id, item.id)
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
                UrlConfig.getDietUrl(item.client.id, item.id),
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
                UrlConfig.getChatMessageUrl(item.senderUserId),
                item.sender.getAvatarOrGravatarUrl() ? item.sender.getAvatarOrGravatarUrl() : this.defaultAvatarUrl
              ));
            }),
          super.translate('module.clients.dashboard.latestMessages'),
          {
            noDataMessage: super.translate('module.clients.dashboard.noChatMessages'),
          }
        );
      });
  }

  private getInitAppointmentObservable(): Observable<void> {
    let appointment: Appointment | undefined;

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
              appointment = response.firstItem();

              // first set box action
              if (this.appointmentInfoBox) {
                const action = appointment ? (
                  new ActionButton('edit', Observable.of(undefined)
                    .map(() => {
                      if (appointment) {
                        this.dependencies.coreServices.navigateService.navigate([UrlConfig.getAppointmentEditUrl(appointment.clientId, appointment.id)]);
                      }
                    }))
                ) :
                  new ActionButton('add', Observable.of(undefined)
                    .map(() => {
                      this.dependencies.coreServices.navigateService.navigate([UrlConfig.getNewAppointmentUrl(this.clientId)]);
                    }));
            
                this.appointmentInfoBox.actions = [action];
              }

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
                  zoom: 13,
                  noDataMessage: super.translate('module.clients.dashboard.noAppointment'),
                }
              );

              const lines: InfoBoxLine[] = [
                new InfoBoxLine([new InfoBoxText(super.formatDate(appointment.appointmentDate), InfoBoxLineType.Title)]),
                new InfoBoxLine([new InfoBoxText(appointment.client.getFullName(), InfoBoxLineType.Body2)]),
                new InfoBoxLine([new InfoBoxText(appointment.location.address, InfoBoxLineType.Body1)])
              ];

              const workout = appointment.workout;
              if (workout) {
                lines.push(new InfoBoxLine([
                  new InfoBoxText(super.translate('module.clients.appointments.workout').map(workoutTitle => workoutTitle + ': '), InfoBoxLineType.Body1),
                  new InfoBoxText(workout.workoutName, InfoBoxLineType.Body1, UrlConfig.getWorkoutUrl(workout.client.id, workout.id)),
                ]
                ));
              }

              if (appointment.notes) {
                lines.push(new InfoBoxLine(
                  [
                    new InfoBoxText(super.translate('module.clients.appointments.notes').map(notes => notes + ': '), InfoBoxLineType.Caption),
                    new InfoBoxText(appointment.notes, InfoBoxLineType.Caption)
                  ]
                ));
              }
         
              return lines;

            }),
          super.translate('module.clients.dashboard.nextAppointment'),
          {
            noDataMessage: super.translate('module.clients.dashboard.noAppointment'),
            actions: [
            ]
          }
        );
      });
  }

  private getInitMenuObservable(): Observable<void> {
    return this.clientChange
      .map(client => {
        // set component config
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

        // set info boxes
        this.privateNotesInfoBox = new InfoBoxConfig(
          Observable.of([
            new InfoBoxLine([new InfoBoxText(client.trainerPrivateNotes, InfoBoxLineType.Body1)])
          ]),
          super.translate('module.clients.dashboard.privateNotes'),
        );

        this.publicNotesInfoBox = new InfoBoxConfig(
          Observable.of([
            new InfoBoxLine([new InfoBoxText(client.trainerPublicNotes, InfoBoxLineType.Body1)])
          ]),
          super.translate('module.clients.dashboard.publicNotes'),
        );
      });
  }

 
}
