// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../core';

// required by component
import { FormConfig } from '../../../../web-components/dynamic-form';
import { Diet } from '../../../models';
import { Observable } from 'rxjs/Rx';

@Component({
    templateUrl: 'edit-diet-export.component.html',
    selector: 'edit-diet-export'
})
export class EditDietExportComponent extends BaseComponent implements OnInit, OnChanges {

    @Output() loadDiet = new EventEmitter();

    @Input() dietId: number;

    private formConfig: FormConfig<Diet>;

    constructor(
        private activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService)
    }

    ngOnChanges(changes: SimpleChanges) {
        var dietId = changes.dietId.currentValue;
        if (dietId) {
            super.subscribeToObservable(this.getFormObservable(dietId));
        }
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    private getFormObservable(dietId: number): Observable<any> {
        return this.dependencies.itemServices.dietService.editForm(dietId)
            .takeUntil(this.ngUnsubscribe)
            .map(form => {
                form.loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader());
                form.onAfterDelete(() => super.navigate([super.getTrainerUrl('diets')]));
                var workout = form.getItem();

                // get form
                this.formConfig = form.build();

                // set loaded workout
                this.loadDiet.next(workout);
            },
            error => super.handleError(error));
    }
}