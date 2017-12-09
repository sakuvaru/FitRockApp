import { Observable } from 'rxjs/Rx';
import { stringHelper } from '../../lib/utilities';

import {
    ControlTypeEnum,
    FormField,
    IItem,
    ResponseCreate,
    ResponseDelete,
    ResponseEdit,
    ResponseFormEdit,
    ResponseFormInsert,
    ErrorResponse,
    FormErrorResponse,
    FormValidationResultEnum,
    ErrorReasonEnum
} from '../../lib/repository';
import {
    DataFieldDropdownOption,
    DataFormDeleteResponse,
    DataFormEditDefinition,
    DataFormEditResponse,
    DataFormError,
    DataFormField,
    DataFormFieldChangeResult,
    DataFormInsertDefinition,
    DataFormInsertResponse,
    DataFormSection,
    DataFormErrorTranslationItem
} from './data-form-models';
import { DataFormConfig } from './data-form.config';
import { DataFormFieldTypeEnum } from './data-form.enums';

export class DataFormBuilder<TItem extends IItem> {

    private config: DataFormConfig;

    constructor(
        type: string,
        isEditForm: boolean,
        isInsertForm: boolean,
        formDefinition: Observable<ResponseFormEdit<TItem> | ResponseFormInsert>,
        saveFunction: (formData: Object) => Observable<ResponseCreate<TItem> | ResponseEdit<TItem>>,
        options?: {
            deleteFunction?: (formData: Object) => Observable<ResponseDelete>
        }
    ) {
        this.config = new DataFormConfig(type);

        // set form status
        this.config.isEditForm = isEditForm;
        this.config.isInsertForm = isInsertForm;

        // assign form definition
        this.config.formDefinition = this.mapFormDefinition(formDefinition);

        // assign save function
        this.config.saveFunction = this.mapSaveFunction(saveFunction);

        // assign delete function if provided
        if (options && options.deleteFunction) {
            this.config.deleteFunction = this.mapDeleteFunction(options.deleteFunction);
        }
    }

    /**
    * Called when a value in a field changes.
    * Can be used to modify the field or value
    */
    onFieldValueChange(callback: (fields: DataFormField[], changedField: DataFormField, newValue: string | Date | number | boolean) => Observable<DataFormFieldChangeResult | void>): this {
        this.config.onFieldValueChange = callback;
        return this;
    }

    /**
    * Resolver used to change the value of certain fields manually
    */
    fieldValueResolver(resolver: (fieldName: string, value: string | number | boolean | Date) => Observable<string | boolean | number | Date>): this {
        this.config.fieldValueResolver = resolver;
        return this;
    }

    /**
     * Indicates if action buttons (save, edit, delete) are rendered
     */
    renderButtons(render: boolean): this {
        this.config.renderButtons = render;
        return this;
    }

    /**
     * Indicates if form is within a card
     * @param wrap Wrap in card
     */
    wrapInCard(wrap: boolean): this {
        this.config.wrapInCard = wrap;
        return this;
    }

    /**
     * Section
     * @param section Section
     */
    section(section: DataFormSection): this {
        if (section instanceof DataFormSection) {
            this.config.sections.push(section);
        }

        this.config.sections.push(new DataFormSection(section.title, section.size, section.rowNumber));

        return this;
    }

    /**
     * Sections of the form
     * @param sections Sections
     */
    sections(sections: DataFormSection[]): this {
        sections.forEach(section => {
            if (section instanceof DataFormSection) {
                this.config.sections.push(section);
            }

            this.config.sections.push(new DataFormSection(section.title, section.size, section.rowNumber));
        });

        return this;
    }

    /**
     * Indicates if form contains delete button and if user can trigger 'delete method' defined in this form config
     * This property has to be enabled if the delete method is to be triggered
     */
    enableDelete(enable: boolean): this {
        this.config.enableDelete = enable;
        return this;
    }

    /**
     * Indicates if field in form are cleared when the form is saved
     */
    clearFormAfterSave(clear: boolean): this {
        this.config.clearFormAfterSave = clear;
        return this;
    }

    /**
    * Callback for when the form has fetched data
    */
    onInsertFormLoaded(resolver: (form: DataFormInsertDefinition) => void): this {
        this.config.onInsertFormLoaded = resolver;
        return this;
    }

    /**
    * Callback for when the form has fetched data
    */
    onEditFormLoaded(resolver: (form: DataFormEditDefinition) => void): this {
        this.config.onEditFormLoaded = resolver;
        return this;
    }

    /**
     * Callback for saving a new item
     */
    onAfterInsert(resolver: (response: DataFormInsertResponse) => void): this {
        this.config.onAfterInsert = resolver;
        return this;
    }

    /**
    * Callback for saving an item
    */
    onAfterEdit(resolver: (response: DataFormEditResponse) => void): this {
        this.config.onAfterEdit = resolver;
        return this;
    }

    /**
     * Callback for errors
     */
    onError(resolver: (error: any) => void): this {
        this.config.onError = resolver;
        return this;
    }

    /**
     * Callback before both updating or inserting an item in the form
     */
    onBeforeSave(resolver: (formData: Object) => void): this {
        this.config.onBeforeDelete = resolver;
        return this;
    }

    /**
     * Callback after deleting an item
     */
    onAfterDelete(resolver: (response: DataFormDeleteResponse) => void): this {
        this.config.onAfterDelete = resolver;
        return this;
    }

    /**
     * Callback before deleting an item
     */
    onBeforeDelete(resolver: (formData: Object) => void): this {
        this.config.onBeforeDelete = resolver;
        return this;
    }

    /**
    * Indicates if local loader is enabled
    */
    enableLocalLoader(enable: boolean): this {
        this.config.enableLocalLoader = enable;
        return this;
    }

    /**
     * Can be used to get custom field labels
     */
    fieldLabelResolver(resolver: (field: DataFormField, originalLabel: string) => Observable<string>): this {
        this.config.fieldLabelResolver = resolver;
        return this;
    }

    /**
    * Can be used to get custom option labels (e.g. in dropdown lists)
    */
    optionLabelResolver(resolver: (field: DataFormField, optionLabel: string) => Observable<string>): this {
        this.config.optionLabelResolver = resolver;
        return this;
    }

    build(): DataFormConfig {
        return this.config;
    }

    private mapFieldType(controlType: ControlTypeEnum): DataFormFieldTypeEnum {
        if (controlType === ControlTypeEnum.Boolean) {
            return DataFormFieldTypeEnum.Boolean;
        } else if (controlType === ControlTypeEnum.Date) {
            return DataFormFieldTypeEnum.Date;
        } else if (controlType === ControlTypeEnum.DateTime) {
            return DataFormFieldTypeEnum.DateTime;
        } else if (controlType === ControlTypeEnum.Dropdown) {
            return DataFormFieldTypeEnum.Dropdown;
        } else if (controlType === ControlTypeEnum.Hidden) {
            return DataFormFieldTypeEnum.Hidden;
        } else if (controlType === ControlTypeEnum.None) {
            return DataFormFieldTypeEnum.None;
        } else if (controlType === ControlTypeEnum.Number) {
            return DataFormFieldTypeEnum.Number;
        } else if (controlType === ControlTypeEnum.PhoneNumber) {
            return DataFormFieldTypeEnum.PhoneNumber;
        } else if (controlType === ControlTypeEnum.RadioBoolean) {
            return DataFormFieldTypeEnum.RadioBoolean;
        } else if (controlType === ControlTypeEnum.Text) {
            return DataFormFieldTypeEnum.Text;
        } else if (controlType === ControlTypeEnum.TextArea) {
            return DataFormFieldTypeEnum.TextArea;
        }

        throw Error(`Unsupported control type '${controlType}' could not be mapped to field type control`);
    }

    private mapDataFormField(field: FormField): DataFormField {
        return new DataFormField(
            field.key,
            this.mapFieldType(field.controlTypeEnum),
            field.required,
            field.value,
            field.defaultValue,
            {
                hint: field.hint,
                rowNumber: field.rowNumber,
                width: field.width,
                options: field.options ? {
                    extraTranslationData: field.options.extraTranslationData,
                    listOptions: field.options.listOptions ? field.options.listOptions.map(m => new DataFieldDropdownOption(m.value, m.name, m.extraDataJson)) : undefined,
                    falseOptionLabel: field.options.falseOptionLabel,
                    maxAutosizeRows: field.options.maxAutosizeRows,
                    maxLength: field.options.maxLength,
                    maxNumberValue: field.options.maxNumberValue,
                    minAutosizeRows: field.options.minAutosizeRows,
                    minLength: field.options.minLength,
                    minNumberValue: field.options.minNumberValue,
                    trueOptionLabel: field.options.trueOptionLabel,
                    icon: field.options.icon
                } : undefined
            }
        );
    }

    private mapDeleteFunction(deleteFunction: (formData: Object) => Observable<ResponseDelete>): (formData: object) => Observable<DataFormDeleteResponse> {
        return (formData: Object) => deleteFunction(formData).map(response => {
            if (response instanceof ResponseDelete) {
                return new DataFormDeleteResponse(response.deletedItemId);
            }
            throw Error(`Unexpected response from delete function`);
        });
    }

    private mapSaveFunction(saveFunction: (formData: Object) => Observable<ResponseEdit<TItem> | ResponseCreate<TItem>>): (formData: object) => Observable<DataFormInsertResponse | DataFormEditResponse> {
        return (formData: Object) => this.mapDataFormError(saveFunction(formData).map(response => {
            if (response instanceof ResponseEdit) {
                return new DataFormEditResponse(response.item);
            }

            if (response instanceof ResponseCreate) {
                return new DataFormInsertResponse(response.item);
            }

            throw Error(`Unexpected response from save function`);
        }));
    }

    private mapFormDefinition(formDefinition: Observable<ResponseFormEdit<TItem> | ResponseFormInsert>): Observable<DataFormEditDefinition | DataFormInsertDefinition> {
        return this.mapDataFormError(formDefinition.map(response => {
            if (response instanceof ResponseFormEdit) {
                return new DataFormEditDefinition(response.fields.map(m => this.mapDataFormField(m)), response.item);
            }

            if (response instanceof ResponseFormInsert) {
                return new DataFormInsertDefinition(response.fields.map(m => this.mapDataFormField(m)));
            }

            throw Error(`Unsupported form definition`);
        })
        );
    }

    private mapDataFormError<TModel>(obs: Observable<TModel>): Observable<any> {
        return obs.catch(error => {
            const field = error.formValidation.column;
            const translationItems: DataFormErrorTranslationItem[] = [];
            let translationKey: string | undefined;

            if (field) {
                translationItems.push(new DataFormErrorTranslationItem('label', `form.${stringHelper.toCamelCase(this.config.type)}.${stringHelper.toCamelCase(field)}`));
            }

            if (error instanceof FormErrorResponse) {
                const formValidationError = error.formValidation.validationResult;

                if (formValidationError === FormValidationResultEnum.InvalidCodename) {
                    if (field) {
                        translationKey = 'form.error.invalidCodenameWithLabel';
                    } else {
                        translationKey = 'form.error.invalidCodename';
                    }
                }

                if (formValidationError === FormValidationResultEnum.InvalidEmail) {
                    if (field) {
                        translationKey = 'form.error.invalidEmailWithLabel';
                    } else {
                        translationKey = 'form.error.invalidEmail';
                    }
                }

                if (formValidationError === FormValidationResultEnum.NotUnique) {
                    if (field) {
                        translationKey = 'form.error.notUniqueWithLabel';
                    } else {
                        translationKey = 'form.error.notUnique';
                    }
                }

                if (formValidationError === FormValidationResultEnum.NotEditable) {
                    if (field) {
                        translationKey = 'form.error.notEditableWithLabel';
                    } else {
                        translationKey = 'form.error.notEditable';
                    }
                }

                if (formValidationError === FormValidationResultEnum.ConstraintConflict) {

                    if (error.formValidation.messageKey) {
                        translationItems.push(new DataFormErrorTranslationItem('dependentType', 'type.' + stringHelper.toCamelCase(error.formValidation.messageKey)));
                        translationKey = 'form.error.constraintConflict';
                    } else {
                        translationKey = 'form.error.genericConstraintConflict';
                    }
                }

                if (formValidationError === FormValidationResultEnum.FormLoadingError) {
                    translationKey = 'form.error.formLoadingError';
                }

                if (formValidationError === FormValidationResultEnum.OneRecordPerDay) {
                    translationKey = 'form.error.oneRecordPerDay';
                }

                if (formValidationError === FormValidationResultEnum.Other) {
                    if (field) {
                        translationKey = 'form.error.otherWithLabel';
                    } else {
                        translationKey = 'form.error.other';
                    }
                }

                return Observable.throw(new DataFormError(
                    translationKey ? translationKey : 'form.error.unknown',
                    field,
                    translationItems
                ));
            }

            if (error instanceof ErrorResponse) {

                if (error.reason === ErrorReasonEnum.LicenseLimitation) {
                    translationKey = 'form.error.insufficientLicense';
                }

                if (error.reason === ErrorReasonEnum.FormError) {
                    translationKey = 'form.error.formLoadingError';
                }

                if (error.reason === ErrorReasonEnum.NotAuthorized) {
                    translationKey = 'form.error.notAuthorized';
                }

                if (error.reason === ErrorReasonEnum.ServerNotRunning) {
                    translationKey = 'form.error.serverDown';
                }

                return Observable.throw(new DataFormError(
                    translationKey ? translationKey : 'form.error.unknown',
                    field,
                    translationItems
                ));
            }

            return Observable.throw(error);
        });
    }
}

class FieldTypeWrapper {
    constructor(
        public value: string | number | boolean | Date,
        public fieldType: DataFormFieldTypeEnum
    ) {
    }
}
