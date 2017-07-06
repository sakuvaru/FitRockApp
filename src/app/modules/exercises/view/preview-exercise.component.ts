// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../core';

// required by component
import { ExercisePreviewMenuItems, ExerciseMenuItems } from '../menu.items';
import { Exercise } from '../../../models';
import 'rxjs/add/operator/switchMap';

@Component({
    templateUrl: 'preview-exercise.component.html'
})
export class PreviewExerciseComponent extends BaseComponent implements OnInit {

    private exercise: Exercise;

    constructor(
        private activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService)
    }

    ngOnInit(): void {
        super.ngOnInit();

        super.startLoader();

        this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .switchMap((params: Params) => this.dependencies.itemServices.exerciseService.item()
                .byId(+params['id'])
                .get()
                .takeUntil(this.ngUnsubscribe))
            .subscribe(response => {
                this.exercise = response.item;

                this.dependencies.authUser
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(user => {
                        if (this.exercise.createdByUserId === user.id) {
                            this.setConfig({
                                menuItems: new ExerciseMenuItems(this.exercise.id).menuItems,
                                menuTitle: {
                                    key: this.exercise.exerciseName
                                },
                                componentTitle: {
                                    'key': 'module.exercises.preview'
                                }
                            });
                        }
                        else {
                            this.setConfig({
                                menuItems: new ExercisePreviewMenuItems(response.item.id).menuItems,
                                menuTitle: {
                                    key: response.item.exerciseName
                                },
                                componentTitle: {
                                    'key': 'module.exercises.preview'
                                }
                            });
                        }
                        super.stopLoader();
                    })
            });
    }
}