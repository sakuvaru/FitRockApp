import { Component, Input, Output, OnInit, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseField } from './base-field.class';
import { FieldControlService } from './field-control.service';

// NOTE: see https://angular.io/docs/ts/latest/cookbook/dynamic-form.html for more details

@Component({
    selector: 'dynamic-form',
    templateUrl: './dynamic-form.component.html',
    providers: [FieldControlService]
})
export class DynamicFormComponent implements OnInit, OnChanges {

    private defaultSubmitText = "Uložit";

    // output events
    @Output() onSubmitEvent = new EventEmitter<FormGroup>();

    // inputs
    @Input() questions: BaseField<any>[] = [];

    @Input() submitText: string;

    form: FormGroup;

    constructor(private fieldControlService: FieldControlService) { }

    private getSubmitText() {
        if (this.submitText) {
            return this.submitText;
        }

        return this.defaultSubmitText;
    }

    ngOnInit() {
        // try to initialize component if questions are available during init
        if (this.questions) {
            this.form = this.fieldControlService.toFormGroup(this.questions);
        }
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        // re-initalize form when questions changes because dynamic form may receive question after the initilization of component
        if (changes.questions){
            this.form = this.fieldControlService.toFormGroup(changes.questions.currentValue);
        }
    }

    onSubmit() {
        this.onSubmitEvent.emit(this.form.value);
    }
}