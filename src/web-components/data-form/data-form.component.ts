import { Component, Input, Output, EventEmitter, ViewContainerRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs/Rx';

// common
import { BaseWebComponent } from '../base-web-component.class';

// data form 
import { DataFormConfig } from './data-form.config';
import { DataFormActiomEnum } from './data-form-action.enum';
import { DataFormDeleteResponse, DataFormEditDefinition, DataFormEditResponse, DataFormField,
    DataFormInsertDefinition, DataFormInsertResponse 
    } from './data-form-models';

// additional services
import * as _ from 'underscore';
import { MatSnackBar } from '@angular/material';
import { observableHelper } from '../../lib/utilities';

@Component({
    selector: 'data-form',
    templateUrl: 'data-form.component.html'
})
export class DataFormComponent extends BaseWebComponent implements OnInit, OnChanges {

    @Input() config: DataFormConfig;

    /**
     * Used for triggering form actions
     */
    private formActionSubject = new Subject<DataFormActiomEnum>();

    /**
     * Indicates if loader is enabled
     */
    public loaderEnabled: boolean = false;

    /**
     * Form group
     */
    public formGroup?: FormGroup;

    /**
     * Currently used fields
     */
    public fields: DataFormField[] = [];

    /**
     * Temp fields
     */
    private tempFields: DataFormField[] = [];

    /**
     * Indicates if there is a problem with loading form
     */
    private errorLoadingForm: boolean = false;

    /**
     * Indicates if unknown error occured
     */
    private unknownError: boolean = false;

    /**
     * Current form error
     */
    private formError?: string;

    /**
    * Flag for initialization component, used because ngOnChanges can be called before ngOnInit
    * which would cause component to be initialized twice (happened when component is inside a dialog)
    * Info: https://stackoverflow.com/questions/43111474/how-to-stop-ngonchanges-called-before-ngoninit/43111597
    */
    public initialized = false;

    public get isInsertForm(): boolean {
        return this.config.isInsertForm;
    }

    public get isEditForm(): boolean {
        return this.config.isEditForm;
    }

    constructor(
    ) {
        super();
    }

    ngOnInit(): void {
        this.initDataForm();
    }

    ngOnChanges(): void {
        this.initDataForm();
    }

    handleDeleteItem(): void {
        this.formActionSubject.next(DataFormActiomEnum.Delete);
    }

    handleEditItem(): void {
        this.formActionSubject.next(DataFormActiomEnum.Edit);
    }

    handleInsertItem(): void {
        this.formActionSubject.next(DataFormActiomEnum.Insert);
    }

    private initDataForm(): void {
        if (!this.config || this.initialized) {
            return;
        }

        // mark component as initialized
        this.initialized = true;

        // init form
        this.getInitFormObservable()
            .takeUntil(this.ngUnsubscribe)
            .subscribe(undefined, error => this.handleLoadError(error));

    }

    private getInitFormObservable(): Observable<void> {
        if (!this.config.formDefinition) {
            throw Error(`Could not init form because declaration of definition is missing`);
        }

        let xDefinition: DataFormEditDefinition | DataFormInsertDefinition;

        return this.config.formDefinition.flatMap(definition => {
            // prepare field observables
            const fieldObservables: Observable<void>[] = [];

            definition.fields.forEach(field => {
                fieldObservables.push(this.resolveField(field)
                    .map(resolvedField => {
                        // add resolved field to temporary fields
                        this.tempFields.push(resolvedField);
                    }));
            });

            // zip all observables
            const fieldObservable = observableHelper.zipObservables(fieldObservables);

            // assign temp definition
            xDefinition = definition;

            return fieldObservable;
        })
        .map(() => {
            // at this point, all fields should be assigned to temp fields
            // reassign fields to their property and clear temp fields
            this.fields = this.tempFields;
            this.clearTempFields();

            // init form group
            this.formGroup = this.toFormGroup(this.fields);

            // subscribe to form changes since form group is initialized
            this.subscribeToFormChanges();

            // trigger form loaded event
            if (this.config.onFormLoaded) {
                this.config.onFormLoaded(xDefinition);
            }
        });

    }

    private editItem(): Observable<void> {
        return Observable.of();
    }

    private deleteItem(): Observable<void> {
        return Observable.of();
    }

    private insertItem(): Observable<void> {
        return Observable.of();
    }

    private subscribeToFormActions(): void {
        let xType: DataFormActiomEnum;

        this.formActionSubject
            .do(() => this.clearErrors())
            .switchMap(type => {
                // remember type
                xType = type;

                if (type === DataFormActiomEnum.Delete) {

                    if (this.config.onBeforeDelete) {
                        this.config.onBeforeDelete(this.getFormValue());
                    }

                    return this.deleteItem();
                }

                if (this.config.onBeforeSave) {
                    this.config.onBeforeSave(this.getFormValue());
                }

                if (type === DataFormActiomEnum.Edit) {
                    return this.editItem();
                }

                if (type === DataFormActiomEnum.Insert) {
                    return this.insertItem();
                }

                throw Error(`Unsuported form action`);
            })
            .takeUntil(this.ngUnsubscribe)
            .subscribe(() => {

                console.log('toto after events');

            }, 
        error => {
            this.handleSaveError(error);
        });
    }

    private getFormValue(): Object {
        return this.formGroup ? this.formGroup.value : undefined;
    }

    private subscribeToFormChanges(): void {
        if (!this.formGroup) {
            throw Error(`Could not subscribe to form changes`);
        }
        this.formGroup.valueChanges
        .takeUntil(this.ngUnsubscribe)
        .subscribe(response => this.handleFormChange());
    }

    private resolveField(field: DataFormField): Observable<DataFormField> {
        // resolve field using custom values
        if (!this.config.fieldValueResolver) {
            return Observable.of(field);
        }

        return this.config.fieldValueResolver(field.key, field.value)
            .map(newValue => {
                field.value = this.getFieldValueSetByResolver(newValue);

                return field;
            });
    }

    private handleLoadError(error): void {
        this.errorLoadingForm = true;
    }

    private handleSaveError(error): void {
        console.log('todo ');
        this.unknownError = true;

        if (this.config.onError) {
            this.config.onError(error);
        }
    }

    private handleFormChange(): void {
        // remove error message when any input in form changes
        this.formError = undefined;
    }

    private clearTempFields(): void {
        this.tempFields = [];
    }

    private clearFields(): void {
        this.fields = [];
    }

    private clearErrors(): void {
        this.errorLoadingForm = false;
        this.formError = undefined;
        this.unknownError = false;
    }

    /**
     * Gets form group out of fields
     * @param fields Fields
     */
    toFormGroup(fields: DataFormField[]): FormGroup {
        const group: any = {};

        if (fields) {
            fields.forEach(question => {
                group[question.key] = question.required ? new FormControl(question.value, Validators.required)
                    : new FormControl(question.value);
            });
        }

        return new FormGroup(group);
    }

    /**
     * Use to manually set value of certain field in form.
     * @param fields all fields in form
     * @param fieldName Name of field
     * @param value Value
     */
    private getFieldValueSetByResolver(value: string | boolean | number): string {
        // boolean field needs to return 'string' with 'false' value otherwise the JSON .NET mapping
        // does not map the object
        if (!value) {
            if (typeof (value) === 'boolean') {
                return 'false';
            }
            return '';
        }

        return value.toString().trim();
    }

}
