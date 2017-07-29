// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../../core';

// required by component
import { ClientMenuItems } from '../../menu.items';
import { FormConfig } from '../../../../../web-components/dynamic-form';
import { User, Workout } from '../../../../models';
import 'rxjs/add/operator/switchMap';

@Component({
    templateUrl: 'workout-client.component.html'
})
export class WorkoutClientComponent extends BaseComponent implements OnInit {

    private clientId: number;
    private workoutExists: boolean = true;
    private workoutTemplates: Workout[] = [];

    constructor(
        private activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService)
    }

    ngOnInit(): void {
        super.ngOnInit();
        super.startLoader();

        // client id
        this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .subscribe((params: Params) => this.clientId = +params['id']);

        // load user
        this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .switchMap((params: Params) => this.dependencies.itemServices.userService.editForm(+params['id']))
            .subscribe(form => {
                var user = form.getItem();

                this.setConfig({
                    menuItems: new ClientMenuItems(user.id).menuItems,
                    menuTitle: {
                        key: 'module.clients.viewClientSubtitle',
                        data: { 'fullName': user.getFullName() }
                    },
                    componentTitle: {
                        'key': 'module.clients.submenu.workout'
                    }
                });


            });

        // simultaneosly try to check if workout is assigned for given user
        this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .switchMap((params: Params) => this.dependencies.itemServices.workoutService.clientHasAssignedWorkout(+params['id']))
            .subscribe(workoutExists => {
                this.workoutExists = workoutExists;
                this.initNewWorkout();
            });
        super.stopLoader();
    }

    private initNewWorkout(): void {
        this.dependencies.itemServices.workoutService.items()
            .byCurrentUser()
            .whereNullOrEmpty('ClientId')
            .orderByAsc("WorkoutName")
            .get()
            .subscribe(response => {
                if (!response.isEmpty()) {
                    this.workoutTemplates = response.items;
                }
            })
    }

    private initExistingWorkout(): void {

    }

    private newWorkoutFromTemplate(data: any): void {
        var selected = data.selected;

        if (!selected) {
            console.log('no workout selected');
        }

        var selectedWorkout = selected.value as Workout;
        console.log(selectedWorkout);
        // copy data from selected workout to a new workout with assigned client
        this.dependencies.itemServices.workoutService.copyFromWorkout(selectedWorkout.id, this.clientId)
            .set()
            .subscribe(response => console.log(response));
    }
}