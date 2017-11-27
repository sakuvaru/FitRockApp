import { DataFormConfig } from './data-form.config';
import {
    DataFormEditResponse, DataFormInsertResponse, DataFormField, DataFormEditDefinition,
    DataFormInsertDefinition, DataFormDeleteResponse, DataFieldDropdownOption, DataFormFieldChangeResult
} from './data-form-models';
import { Observable } from 'rxjs/Rx';
import { ResponseFormEdit, ResponseFormInsert, IItem, FormField, ControlTypeEnum, 
    ResponseEdit, ResponseCreate, ResponseDelete } from '../../lib/repository';
import { DataFormFieldTypeEnum } from './data-form-field-type.enum';

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
    fieldValueResolver(resolver: (fieldName: string, value: string | number | boolean | Date) => Observable<string | boolean | number>): this {
        this.config.fieldValueResolver = resolver;
        return this;
    }

    wrapInCard(wrap: boolean): this {
        this.config.wrapInCard = wrap;
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
            {
                defaultValue: field.defaultValue,
                hint: field.hint,
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
        return (formData: Object) => saveFunction(formData).map(response => {
            if (response instanceof ResponseEdit) {
                return new DataFormEditResponse(response.item);
            }

            if (response instanceof ResponseCreate) {
                return new DataFormInsertResponse(response.item);
            }

            throw Error(`Unexpected response from save function`);
        });
    }

    private mapFormDefinition(formDefinition: Observable<ResponseFormEdit<TItem> | ResponseFormInsert>): Observable<DataFormEditDefinition | DataFormInsertDefinition> {
        return formDefinition.map(response => {
            if (response instanceof ResponseFormEdit) {
                return new DataFormEditDefinition(response.fields.map(m => this.mapDataFormField(m)));
            }

            if (response instanceof ResponseFormInsert) {
                return new DataFormInsertDefinition(response.fields.map(m => this.mapDataFormField(m)));
            }

            throw Error(`Unsupported form definition`);
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
