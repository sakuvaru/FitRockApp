// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../core';

// required by component
import { FormConfig } from '../../../../web-components/dynamic-form';
import { Diet } from '../../../models';
import 'rxjs/add/operator/switchMap';

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
            this.initForm(dietId);
        }
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    private initForm(dietId: number): void {
        super.startLoader();

        this.dependencies.itemServices.dietService.editForm(dietId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(form => {
                form.onFormLoaded(() => super.stopLoader());
                form.onBeforeSave(() => super.startGlobalLoader());
                form.onAfterSave(() => super.stopGlobalLoader());
                form.onError(() => super.stopGlobalLoader());
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