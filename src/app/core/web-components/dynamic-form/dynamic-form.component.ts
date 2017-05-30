import { Component, Input, Output, OnInit, EventEmitter, OnChanges, SimpleChange } from '@angular/core';

import { FormGroup } from '@angular/forms';
import { BaseField } from './base-field.class';
import { FieldControlService } from './field-control.service';
import { FormConfig } from './form-config.class';
import { MdSnackBar } from '@angular/material';
import { ResponseCreate, ResponseEdit } from '../../../repository/responses';

import 'rxjs/add/operator/catch';

// NOTE: see https://angular.io/docs/ts/latest/cookbook/dynamic-form.html for more details

@Component({
    selector: 'dynamic-form',
    templateUrl: './dynamic-form.component.html',
    providers: [FieldControlService]
})
export class DynamicFormComponent implements OnInit, OnChanges {

    private questions: BaseField<any>[];

    private submitText: string;

    public response: any;

    private form: FormGroup;

    // output events
    @Output() onSubmitEvent = new EventEmitter<FormGroup>();

    // inputs
    @Input() config: FormConfig<any>;

    constructor(
        private fieldControlService: FieldControlService,
        private snackBarService: MdSnackBar,
    ) { }


    ngOnInit() {
        // try to initialize component if config is available during init
        if (this.config) {
            // load fields
            this.config.fieldsLoader().subscribe(fields => {
                this.form = this.fieldControlService.toFormGroup(fields);
                this.questions = fields;
            });

            this.submitText = this.config.submitText;
        }
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        // re-initalize form when questions changes because dynamic form may recieve config with questions 
        // after the initilization of component 
        if (changes.config) {
            // load fields
            changes.config.currentValue.fieldsLoader().subscribe(fields => {
                this.form = this.fieldControlService.toFormGroup(fields);
                this.questions = fields;
            });

            changes.config.currentValue.submitText = changes.config.currentValue.submitText;
        }
    }

    onSubmit() {
        // emit event
        this.onSubmitEvent.emit(this.form.value);

        // save form
        if (this.config.isInsertForm()) {
            this.config.insertFunction(this.form.value)
                .subscribe(response => {
                    this.response = response;
                    this.handleInsertAfter(response);
                },
                (err) => this.handleError(err));
        }
        else if (this.config.isEditForm()) {
            this.config.editFunction(this.form.value)
                .catch(err => {
                    this.handleError(err);
                    throw err;
                })
                .subscribe(response => {
                    this.response = response;
                    this.handleUpdateAfter(response);
                },
                (err) => this.handleError(err));
        }
        else {
            throw Error("No save function was provided to form");
        }
    }

    private handleSnackBar(): void {
        if (this.config.showSnackBar) {
            this.snackBarService.open(this.config.snackBarText, null, { duration: 2500 });
        }
    }

    private handleUpdateAfter(response: ResponseEdit<any> | any): void {
        this.handleSnackBar();

        if (this.config.updateCallback) {
            this.config.updateCallback(response);
        }
    }

    private handleInsertAfter(response: ResponseCreate<any> | any): void {
        this.handleSnackBar();

        if (this.config.insertCallback) {
            this.config.insertCallback(response);
        }
    }

    private handleError(err: string): void {
        if (this.config.errorCallback) {
            this.config.errorCallback(err);
        }
    }
}