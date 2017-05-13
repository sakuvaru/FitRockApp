import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseField } from './base-field.class';
import { FieldControlService } from './field-control.service';

// NOTE: see https://angular.io/docs/ts/latest/cookbook/dynamic-form.html for more details

@Component({
    selector: 'dynamic-form',
    templateUrl: './dynamic-form.component.html',
    providers: [FieldControlService]
})
export class DynamicFormComponent implements OnInit {
    // output events
    @Output() onSubmitEvent = new EventEmitter<FormGroup>();

    // input
    @Input() questions: BaseField<any>[] = [];

    form: FormGroup;

    constructor(private fieldControlService: FieldControlService) { }

    ngOnInit() {
        this.form = this.fieldControlService.toFormGroup(this.questions);
    }

    onSubmit() {
        this.onSubmitEvent.emit(this.form.value);
    }
}