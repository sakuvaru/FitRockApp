import { DataFormFieldTypeEnum } from './data-form-field-type.enum';

export class DataFormField {

    /**
     * Value of the field
     */
    public value?: string | number | Date | boolean;

    /**
     * Default value of the field
     */
    public defaultValue?: string | number | Date | boolean;

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
        
        optional?: {
            // optional
            defaultValue?: any,
            options?: DataFormFieldOptions,
            hint?: string
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
        public fields: DataFormField[]
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


