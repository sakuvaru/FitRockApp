import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { BaseModuleComponent, ComponentDependencyService } from '../../../core';
import { Exercise } from '../../../models';

@Component({
    selector: 'mod-preview-exercise',
    templateUrl: 'preview-exercise.component.html'
})
export class PreviewExerciseComponent extends BaseModuleComponent implements OnInit, OnChanges {

    @Input() exerciseId: number;

    @Output() loadExercise = new EventEmitter<Exercise>();

    public exercise?: Exercise;

    constructor(
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService);
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.exerciseId) {
            super.subscribeToObservable(this.getItemObservable());
        }
    }

    private getItemObservable(): Observable<void> {
        return this.dependencies.itemServices.exerciseService.item()
            .byId(this.exerciseId)
            .get()
            .map(response => {
                this.loadExercise.next(response.item);
                this.exercise = response.item;
            });
    }
}
