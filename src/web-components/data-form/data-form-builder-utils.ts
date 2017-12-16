import { Observable } from 'rxjs/Rx';

import {
    ControlTypeEnum,
    ErrorReasonEnum,
    ErrorResponse,
    FormErrorResponse,
    FormField,
    FormValidationResultEnum,
    ResponseCreate,
    ResponseDelete,
    ResponseEdit,
    ResponseFormEdit,
    ResponseFormInsert,
} from '../../lib/repository';
import { stringHelper } from '../../lib/utilities';
import {
    DataFieldDropdownOption,
    DataFormDeleteResponse,
    DataFormEditDefinition,
    DataFormEditResponse,
    DataFormError,
    DataFormErrorTranslationItem,
    DataFormField,
    DataFormInsertDefinition,
    DataFormInsertResponse,
} from './data-form-models';
import { DataFormFieldTypeEnum } from './data-form.enums';

class DataFormBuilderUtils {

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

     mapDeleteFunction(deleteFunction: (formData: Object) => Observable<ResponseDelete>): (formData: object) => Observable<DataFormDeleteResponse> {
        return (formData: Object) => deleteFunction(formData).map(response => {
            if (response instanceof ResponseDelete) {
                return new DataFormDeleteResponse(response.deletedItemId);
            }
            throw Error(`Unexpected response from delete function`);
        });
    }

     mapSaveFunction(type: string, saveFunction: (formData: Object) => Observable<ResponseEdit<any> | ResponseCreate<any>>): (formData: object) => Observable<DataFormInsertResponse | DataFormEditResponse> {
        return (formData: Object) => this.mapDataFormError(type, saveFunction(formData).map(response => {
            if (response instanceof ResponseEdit) {
                return new DataFormEditResponse(response.item);
            }

            if (response instanceof ResponseCreate) {
                return new DataFormInsertResponse(response.item);
            }

            throw Error(`Unexpected response from save function`);
        }));
    }

     mapFormDefinition(type: string, formDefinition: Observable<ResponseFormEdit<any> | ResponseFormInsert>): Observable<DataFormEditDefinition | DataFormInsertDefinition> {
        return this.mapDataFormError(type, formDefinition.map(response => {
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

     mapDataFormError<TModel>(type: string, obs: Observable<TModel>): Observable<any> {
        return obs.catch(error => {
            const field = error.formValidation.column;
            const translationItems: DataFormErrorTranslationItem[] = [];
            let translationKey: string | undefined;

            if (field) {
                translationItems.push(new DataFormErrorTranslationItem('label', `form.${stringHelper.toCamelCase(type)}.${stringHelper.toCamelCase(field)}`));
            }

            if (error instanceof FormErrorResponse) {
                const formValidationError = error.formValidation.validationResult;

                // error with custom message
                if (formValidationError === FormValidationResultEnum.CustomWithMessageKey) {
                    translationKey = `form.${stringHelper.toCamelCase(type)}.${error.formValidation.messageKey}`;
                }

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


export const dataFormBuilderUtils = new DataFormBuilderUtils();
