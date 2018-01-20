import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BasePageComponent, ComponentDependencyService } from '../../../core';
import { Exercise } from '../../../models';
import { ExerciseMenuItems } from '../menu.items';

@Component({
    templateUrl: 'edit-exercise-page.component.html'
})
export class EditExercisePageComponent extends BasePageComponent implements OnInit {

    public exerciseId?: number;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService, activatedRoute);
    }

    ngOnInit(): void {
        super.ngOnInit();

        super.subscribeToObservable(
            this.activatedRoute.params.map(params => {
                this.exerciseId = +params['id'];
            })
        );
    }

    handleLoadExercise(exercise: Exercise): void {
        this.setConfig({
            menuItems: new ExerciseMenuItems(exercise.id).menuItems,
            menuTitle: {
                key: exercise.exerciseName
            },
            componentTitle: {
                'key': 'module.exercises.edit'
            }
        });
    }
}
