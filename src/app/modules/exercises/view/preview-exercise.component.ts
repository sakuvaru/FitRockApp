// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { ExercisePreviewMenuItems, ExerciseMenuItems } from '../menu.items';
import { Exercise } from '../../../models';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Rx';

@Component({
    templateUrl: 'preview-exercise.component.html'
})
export class PreviewExerciseComponent extends BaseComponent implements OnInit {

    public exercise: Exercise;

    constructor(
        private activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService);
    }

    setup(): ComponentSetup {
        return new ComponentSetup({
            initialized: true,
            isNested: false
        });
    }

    ngOnInit(): void {
        super.ngOnInit();

        super.subscribeToObservable(this.getItemObservable());
    }

    private getItemObservable(): Observable<any> {
        return this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .switchMap((params: Params) => this.dependencies.itemServices.exerciseService.item()
                .byId(+params['id'])
                .get()
                .takeUntil(this.ngUnsubscribe))
            .map(response => {
                this.exercise = response.item;

                if (this.exercise.createdByUserId === this.dependencies.authenticatedUserService.getUserId()) {
                    this.setConfig({
                        menuItems: new ExerciseMenuItems(this.exercise.id).menuItems,
                        menuTitle: {
                            key: this.exercise.exerciseName
                        },
                        componentTitle: {
                            'key': 'module.exercises.preview'
                        }
                    });
                } else {
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
            });
    }
}
