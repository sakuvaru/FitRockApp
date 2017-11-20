// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../../core';
import { AppConfig, UrlConfig } from '../../../../config';

// required by component
import { Observable } from 'rxjs/Rx';
import { ClientsBaseComponent } from '../../clients-base.component';
import { ClientEditWorkoutMenuItems } from '../../menu.items';
import { Workout } from '../../../../models';

@Component({
  templateUrl: 'edit-client-workout-plan.component.html'
})
export class EditClientWorkoutPlanComponent extends ClientsBaseComponent implements OnInit {

  public workoutId: number;
  public workout: Workout;

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

  ngOnInit() {
    super.ngOnInit();

    this.initWorkoutId();
    super.subscribeToObservable(this.getMenuInitObservable());
    super.initClientSubscriptions();
  }

  private initWorkoutId(): void {
    this.activatedRoute.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe(params => {
        this.workoutId = +params['workoutId'];
      });
  }

  private getMenuInitObservable(): Observable<any> {
    return this.clientChange.map(client => {
      this.setConfig({
        menuItems: new ClientEditWorkoutMenuItems(client.id, this.workoutId).menuItems,
        menuTitle: {
          key: 'module.clients.viewClientSubtitle',
          data: { 'fullName': client.getFullName() }
        },
        menuAvatarUrl: client.avatarUrl
      });
    });
  }

  public handleLoadWorkout(workout: Workout): void {
    const translationData: any = {};
    translationData.workoutName = workout.workoutName;
    super.updateComponentTitle({ key: 'module.clients.workout.editWorkoutWithName', data: translationData });
  }
}
