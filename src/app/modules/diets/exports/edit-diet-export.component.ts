// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { FormConfig } from '../../../../web-components/dynamic-form';
import { Diet } from '../../../models';
import { Observable } from 'rxjs/Rx';

@Component({
    templateUrl: 'edit-diet-export.component.html',
    selector: 'edit-diet-export'
})
export class EditDietExportComponent extends BaseComponent implements OnInit, OnChanges {

    @Output() loadDiet = new EventEmitter<Diet>();

    @Input() dietId: number;

    private formConfig: FormConfig<Diet>;

    constructor(
        private activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService);
    }

    setup(): ComponentSetup | null {
        return null;
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
            .onAfterDelete(() => super.navigate([super.getTrainerUrl('diets')]))
            .onFormLoaded(form => {
                const diet = form.item;

                // set loaded workout
                this.loadDiet.next(diet);
            })
            .build();
    }
}
