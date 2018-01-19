import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import {
  ActionButton,
  InfoBoxConfig,
  InfoBoxLine,
  InfoBoxLineType,
  InfoBoxText,
  ListBoxConfig,
  ListBoxItem,
  MapBoxConfig,
} from 'web-components/boxes';

import { AppConfig, UrlConfig } from '../../../config';
import { ComponentDependencyService } from '../../../core';
import { Appointment } from '../../../models';
import { BaseClientModuleComponent } from '../base-client-module.component';

@Component({
  selector: 'mod-client-dashboard',
  templateUrl: 'client-dashboard.component.html'
})
export class ClientDashboardComponent extends BaseClientModuleComponent implements OnInit, OnChanges {

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
    protected componentDependencyService: ComponentDependencyService,
  ) {
    super(componentDependencyService);
  }

  ngOnChanges(changes: SimpleChanges): void {
        if (this.client) {
          this.init();
        }
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  private init(): void {
    this.initWorkouts();
    this.initDiets();
    this.initChatMessages();
    this.initAppointments();
    this.initNotesInfoBoxes();
  }

  private initWorkouts(): void {
        this.workoutsListBox = new ListBoxConfig(
          this.dependencies.itemServices.workoutService.items()
            .byCurrentUser()
            .whereEquals('ClientId', this.client.id)
            .orderByDesc('Id')
            .get()
            .map(response => {
              return response.items.map(item => new ListBoxItem(
                Observable.of(item.workoutName),
                {
                  linkUrl: UrlConfig.getWorkoutUrl(item.clientId ? item.clientId : 0, item.id)
                }
              ));
            }),
          super.translate('module.clients.dashboard.workouts'),
          {
            noDataMessage: super.translate('module.clients.dashboard.noWorkouts')
          }
        );
  }

  private initDiets(): void {
        this.dietsListBox = this.dependencies.webComponentServices.boxService.listBox(
          this.dependencies.itemServices.dietService.items()
            .byCurrentUser()
            .whereEquals('ClientId', this.client.id)
            .orderByDesc('Id')
            .get()
            .map(response => {
              return response.items.map(item => new ListBoxItem(
                Observable.of(item.dietName),
                {
                  linkUrl: UrlConfig.getDietUrl(item.clientId ? item.clientId : 0, item.id)
                }
              ));
            }),
          super.translate('module.clients.dashboard.diets'),
          {
            noDataMessage: super.translate('module.clients.dashboard.noDiets')
          });
  }

  private initChatMessages(): void {
        this.chatMessagesListBox = this.dependencies.webComponentServices.boxService.listBox(
          this.dependencies.itemServices.chatMessageService.getConversationMessages(this.client.id)
            .limit(6)
            .orderByDesc('Id')
            .get()
            .map(response => {
              return response.items.map(item => new ListBoxItem(
                Observable.of(item.message),
                {
                  linkUrl: UrlConfig.getChatMessageUrl(this.client.id),
                  imageUrl: item.sender.getAvatarOrGravatarUrl() ? item.sender.getAvatarOrGravatarUrl() : this.defaultAvatarUrl
                }
              ));
            }),
          super.translate('module.clients.dashboard.latestMessages'),
          {
            noDataMessage: super.translate('module.clients.dashboard.noChatMessages'),
          }
        );
  }

  private initAppointments(): void {
    let appointment: Appointment | undefined;

        const dateNow = new Date();
        dateNow.setSeconds(0);
        dateNow.setMilliseconds(0);

        this.appointmentInfoBox = this.dependencies.webComponentServices.boxService.infoBox(
          this.dependencies.itemServices.appointmentService.items()
            .limit(1)
            .byCurrentUser()
            .whereEquals('ClientId', this.client.id)
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
                      this.dependencies.coreServices.navigateService.navigate([UrlConfig.getNewAppointmentUrl(this.client.id)]);
                    }));
            
                this.appointmentInfoBox.actions = [action];
              }

              if (!appointment) {
                return [];
              }

              // also init map
              this.appointmentMapBox = this.dependencies.webComponentServices.boxService.mapBox(
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
                  new InfoBoxText(workout.workoutName, InfoBoxLineType.Body1, UrlConfig.getWorkoutUrl(workout.clientId ? workout.clientId : 0, workout.id)),
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
  }

  private initNotesInfoBoxes(): void {
        // set info boxes
        this.privateNotesInfoBox = this.dependencies.webComponentServices.boxService.infoBox(
          Observable.of([
            new InfoBoxLine([new InfoBoxText(this.client.trainerPrivateNotes, InfoBoxLineType.Body1)])
          ]),
          super.translate('module.clients.dashboard.privateNotes'),
        );

        this.publicNotesInfoBox = this.dependencies.webComponentServices.boxService.infoBox(
          Observable.of([
            new InfoBoxLine([new InfoBoxText(this.client.trainerPublicNotes, InfoBoxLineType.Body1)])
          ]),
          super.translate('module.clients.dashboard.publicNotes'),
        );
  }
}
