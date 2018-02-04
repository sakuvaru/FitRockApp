import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ListBoxConfig, ListBoxItem, ListBoxLine, MapBoxConfig, TableBoxConfig, TableBoxLine } from 'web-components/boxes';

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

  public noAppointment: boolean = false;

  public dietsListBox?: ListBoxConfig;
  public workoutsListBox?: ListBoxConfig;
  public appointmentMapBox?: MapBoxConfig;
  public appointmentBox?: TableBoxConfig;

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
    this.initAppointments();
  }

  private initWorkouts(): void {
    this.workoutsListBox = new ListBoxConfig(
      this.dependencies.itemServices.workoutService.items()
        .byCurrentUser()
        .whereEquals('ClientId', this.client.id)
        .orderByDesc('Id')
        .get()
        .map(response => {
          return response.items.map(item => new ListBoxItem([
            new ListBoxLine(Observable.of(item.workoutName))
          ],
            {
              linkUrl: UrlConfig.getWorkoutUrl(item.clientId ? item.clientId : 0, item.id)
            }
          ));
        }),
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
          return response.items.map(item => new ListBoxItem([
            new ListBoxLine(Observable.of(item.dietName))
          ],
            {
              linkUrl: UrlConfig.getDietUrl(item.clientId ? item.clientId : 0, item.id)
            }
          ));
        }),
      {
        noDataMessage: super.translate('module.clients.dashboard.noDiets')
      });
  }

  private initAppointments(): void {
    let appointment: Appointment | undefined;

    const dateNow = new Date();
    dateNow.setSeconds(0);
    dateNow.setMilliseconds(0);

    super.subscribeToObservable(this.dependencies.itemServices.appointmentService.items()
    .limit(1)
    .byCurrentUser()
    .whereEquals('ClientId', this.client.id)
    .whereGreaterThan('AppointmentDate', dateNow)
    .orderByAsc('AppointmentDate')
    .includeMultiple(['Workout', 'Location', 'Client'])
    .get()
    .map(response => {
      appointment = response.firstItem();

      if (appointment) {
      const lines = [
        new TableBoxLine(super.translate('Kdy'), Observable.of(super.formatTime(appointment.appointmentDate))),
        new TableBoxLine(super.translate('Kde'), Observable.of(appointment.location.address))
      ];

      if (appointment.workout) {
        lines.push(
          new TableBoxLine(super.translate('Trénink'), Observable.of(appointment.workout.workoutName))
        );
      }

        // appointment box
        this.appointmentBox = this.dependencies.webComponentServices.boxService.tableBox(Observable.of(lines));
       
        // map box
        this.appointmentMapBox = this.dependencies.webComponentServices.boxService.mapBox(
          this.googleApiKey,
          appointment.location.address,
          appointment.location.lat,
          appointment.location.lng,
          {
            zoom: 13,
          }
        );
      } else {
        this.noAppointment = true;
      }
    }));
  }
}
