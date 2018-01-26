import { Observable } from 'rxjs/Observable';

import { DataFormFieldTypeEnum, DataFormSectionSize } from './data-form.enums';

export class DataFormInternalProperties {

    /**
     * Item loaded by the form (if available - e.g. edit form)
     */
    public item?: any;
}

export class DataFormField {

    /**
     * Additional field options
     */
    public options: DataFormFieldOptions = new DataFormFieldOptions();

    /**
     * Label of the field
     */
    public label: string;

    /**
    * Hint of the fiend
    */
    public hint?: string;

    /**
     * Row number (used for grouping multiple fields into a single row)
     */
    public rowNumber?: number;

    /**
     * Width of the field
     */
    public width?: number;

    public internalProperties: DataFormInternalProperties = new DataFormInternalProperties();

    constructor(
        /**
         * Key (column) of the field
         */
        public key: string,

        /**
         * Type used to render the field
         */
        public fieldType: DataFormFieldTypeEnum,

        /**
         * Indicates if field is required
         */
        public required: boolean,

        /** 
         * Value of field
        */
        public value?: string | boolean | Date | number | Object,

        /**
        * Default value of the field
        */
        public defaultValue?: string | number | Date | boolean | Object,

        /**
        * Indicates if field is disabled
        */
        public disabled?: boolean,

        optional?: {
            options?: DataFormFieldOptions,
            hint?: string,
            rowNumber?: number,
            width?: number,
        }) {
        Object.assign(this, optional);
    }
}

export class DataFormFieldOptions {

    /**
     * Maximum length of field (characters)
     */
    public maxLength?: number;

    /**
     * Minimum length of field (characters)
     */
    public minLength?: number;

    /**
     * Maximum number of rows in case of textarea
     */
    public maxAutosizeRows?: number;

    /**
     * Minimum number of rows in case of textarea
     */
    public minAutosizeRows?: number;

    /**
     * List of options in case of dropdown list
     */
    public listOptions?: DataFieldDropdownOption[];

    /**
     * Label of 'true' option in case of radio check box
     */
    public trueOptionLabel?: string;

    /**
     * Label of 'false' option in case of radio check box
     */
    public falseOptionLabel?: string;

    /**
     * Maximum number value
     */
    public maxNumberValue?: number;

    /**
     * Minimum number value
     */
    public minNumberValue?: number;

    /**
     * Used for passing extra data to translation
     */
    public extraTranslationData?: any;

    /**
     * Icon
     */
    public icon?: string;

    constructor(options?: {
        maxLength?: number,
        minLength?: number,
        maxAutosizeRows?: number,
        minAutosizeRows?: number,
        listOptions?: DataFieldDropdownOption[],
        trueOptionLabel?: string,
        falseOptionLabel?: string,
        maxNumberValue?: number,
        minNumberValue?: number,
        extraTranslationData?: any,
        icon?: string,
    }) {
        if (options) {
            Object.assign(this, options);
        }
    }
}

export class DataFieldDropdownOption {
    constructor(
        public value: string,
        public name: string,
        public extraDataJson?: any
    ) {

    }
}

export abstract class DataFormAbstractDefinition {
    constructor(
        public fields: DataFormField[]
    ) { }
}

export class DataFormEditDefinition<TModel> extends DataFormAbstractDefinition {

    constructor(
        public fields: DataFormField[],
        public item: TModel
    ) {
        super(fields);
    }
}

export class DataFormInsertDefinition extends DataFormAbstractDefinition {
    constructor(
        public fields: DataFormField[]
    ) {
        super(fields);
    }
}

export class DataFormEditResponse<TModel> {
    constructor(
        public item: TModel
    ) { }
}

export class DataFormInsertResponse<TModel> {
    constructor(
        public item: TModel
    ) { }
}

export class DataFormDeleteResponse {
    constructor(
        public deletedItemId: number
    ) { }
}

export class DataFormChangeField {
    constructor(
        public key: string,
        public newValue: boolean | string | object | undefined | Date | number
    ) { }
}

export class DataFormFieldChangeResult {
    constructor(
        public changedFields: DataFormChangeField[]
    ) { }
}

export class DataFormSection {
    constructor(
        public title: Observable<string>,
        public size: DataFormSectionSize,
        public rowNumber: number
    ) { }
}

export class DataFormError { 
    constructor(
        public originalError: any,
        public translationKey: string,
        public field?: string,
        public dataToTranslate?: DataFormErrorTranslationItem[]
    ) { }
}

export class DataFormErrorTranslationItem {
    constructor(
        public name: string,
        public value: string
    ) { }
}

export class DataFormMultipleChoiceFieldConfig<TModel> {

    public assignedItems: (field: DataFormField, item: any) => Observable<DataFormMultipleChoiceItem<TModel>[]>;
    public onDialogClick: (field: DataFormField, item: any) => void;
    public onEditSelected: (selectedItems: DataFormMultipleChoiceItem<TModel>[]) => void;
    public itemChange: Observable<DataFormMultipleChoiceItem<TModel>>;
    public addButtonText: Observable<string>;
    public removeButtonText: Observable<string>;
    public editButtonText: Observable<string>;

    constructor(
        data: {
             assignedItems: (field: DataFormField, item: any) => Observable<DataFormMultipleChoiceItem<TModel>[]>,
             onDialogClick: (field: DataFormField, item: any) => void,
             onEditSelected: (selectedItems: DataFormMultipleChoiceItem<TModel>[]) => void,
             itemChange: Observable<DataFormMultipleChoiceItem<TModel>>,
             addButtonText: Observable<string>,
             removeButtonText: Observable<string>,
             editButtonText: Observable<string>
        }
    ) { 
        Object.assign(this, data);
    }
}

export class DataFormMultipleChoiceItem<TModel> {
    constructor(
        public identifier: string,
        public rawValue: TModel,
        public itemName: Observable<string>,
        public metaLines?: Observable<string>[]
    ) { }
}




