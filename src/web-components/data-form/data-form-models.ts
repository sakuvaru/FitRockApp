import { Observable } from 'rxjs/Observable';

import { DataFormFieldTypeEnum, DataFormSectionSize } from './data-form.enums';

export class DataFormField {

    /**
     * Additional field options
     */
    public options?: DataFormFieldOptions;

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
        public value?: string | boolean | Date | number,

        /**
        * Default value of the field
        */
        public defaultValue?: string | number | Date | boolean,

        optional?: {
            // optional
            options?: DataFormFieldOptions,
            hint?: string,
            rowNumber?: number,
            width?: number
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
    }) {
        Object.assign(this, options);
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

export class DataFormEditDefinition extends DataFormAbstractDefinition {

    constructor(
        public fields: DataFormField[],
        public item: any
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

export class DataFormEditResponse {
    constructor(
        public item: any
    ) { }
}

export class DataFormInsertResponse {
    constructor(
        public item: any
    ) { }
}

export class DataFormDeleteResponse {
    constructor(
        public deletedItemId: number
    ) { }
}

export class DataFormFieldChangeResult {
    constructor(
        public value: string | number | Date | boolean
    ) { }
}

export class DataFormSection {
    constructor(
        public title: Observable<string>,
        public size: DataFormSectionSize,
        public rowNumber: number
    ) { }
}



