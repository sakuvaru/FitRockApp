// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../core';

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
        super(componentDependencyService);
    }

    setup(): ComponentSetup | null {
        return {
            initialized: true
        };
      }

    ngOnChanges(changes: SimpleChanges) {
        const dietId = changes.dietId.currentValue;
        if (dietId) {
            this.initForm(dietId);
        }
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    private initForm(dietId: number): void {
        this.formConfig = this.dependencies.itemServices.dietService.editForm(dietId)
            .loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader())
            .onAfterDelete(() => super.navigate([super.getTrainerUrl('diets')]))
            .onFormLoaded(form => {
                const workout = form.item;

                // set loaded workout
                this.loadDiet.next(workout);
            })
            .build();
    }
}
