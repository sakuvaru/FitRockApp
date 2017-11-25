import { Component, Input, AfterViewInit, ChangeDetectorRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { FormField, ControlTypeEnum, DropdownFieldOption } from '../../../lib/repository';
import { TranslateService } from '@ngx-translate/core';
import { DataFormConfig } from '../data-form.config';
import { stringHelper, numberHelper } from '../../../lib/utilities';
import { BaseWebComponent } from '../../base-web-component.class';
import { Observable } from 'rxjs/Rx';

export abstract class BaseFormControlComponent extends BaseWebComponent implements OnInit, OnChanges {

    @Input() question: FormField;
    @Input() form: FormGroup;
    @Input() formConfig: DataFormConfig;

    /**
     * Holds error message
     */
    private error: string = '';

    /**
     * Indicates when the field is initialized
     */
    public initialized: boolean = false;

    /**
     * Can be used to perform custom validation on the field.
     * Has to be set before calling ngOnInit && ngOnChanges
     */
    protected customValidator: (value: any) => ValueValidationResult;


    constructor(
        protected cdr: ChangeDetectorRef,
        protected translateService: TranslateService,
    ) {
        super();
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
    }

}

export class ValueValidationResult {
    constructor(
        public isValid: boolean,
        public errorMessageKey: string,
        public translationData: any
    ) { }
}
