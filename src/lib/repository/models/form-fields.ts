import { ControlTypeEnum } from '../enums/control-type.enum';
import { IDropdownFieldOption, IFormField, IFormFieldOptions } from '../interfaces/iform-fields';

export class FormField implements IFormField {

    /**
     * Raw value of given field
     */
    public rawValue?: any;

    /**
     * Value of the field
     */
    public value?: any;

    /**
     * Default value of the field
     */
    public defaultValue?: any;

    /**
     * Key of the field (= property name/column)
     */
    public key: string;

    /**
     * Indicates if field is required
     */
    public required: boolean;

    /**
     * Control type that is used to render the field in form (e.g. checkbox, radiobutton, textarea..)
     */
    public controlType: string;

    /**
     * Strongly typed Control type
     */
    public controlTypeEnum: ControlTypeEnum;

    /**
     * Additional field options
     */
    public options?: IFormFieldOptions;

    /**
     * Label of the field
     */
    public label: string;

    /**
    * Hint of the fiend
    */
    public hint?: string;

    /**
    * Requested width of the field
    */
    public width?: number;

    /**
     * Requested row number
     */
    public rowNumber?: number;

    constructor(constructorOptions: {
        // required
        key: string,
        controlType: string,

        // optional
        rawValue?: any,
        defaultValue?: any,
        required?: boolean,
        options?: IFormFieldOptions,
        hint?: string,
        width?: number,
        rowNumber?: number,
    }) {
        Object.assign(this, constructorOptions);

        this.mapFormField(this.controlType, constructorOptions.rawValue, constructorOptions.defaultValue);
    }

    showLengthHint(): boolean {
        if (!this.options) {
            return false;
        }
        if (!this.options.maxLength) {
            return false;
        }
        if (this.options.maxLength > 0) {
            return true;
        }
        return false;
    }

    private mapFormField(controlType: string, rawValue: any, defaultValue: any): void {
        // by default the rawValue === value, however some fields need to be converted to their proper types (e.g. number, boolean or Date)
        this.value = rawValue;

        if (controlType === 'None') {
            this.controlTypeEnum = ControlTypeEnum.None;
        } else if (controlType === 'Dropdown') {
            this.controlTypeEnum = ControlTypeEnum.Dropdown;
        } else if (controlType === 'Date') {
            this.controlTypeEnum = ControlTypeEnum.Date;
            if (rawValue) {
                this.value = new Date(rawValue);
                this.defaultValue = new Date(defaultValue);
            }
        } else if (controlType === 'Boolean') {
            this.controlTypeEnum = ControlTypeEnum.Boolean;
        } else if (controlType === 'RadioBoolean') {
            this.controlTypeEnum = ControlTypeEnum.RadioBoolean;
        } else if (controlType === 'Text') {
            this.controlTypeEnum = ControlTypeEnum.Text;
        } else if (controlType === 'TextArea') {
            this.controlTypeEnum = ControlTypeEnum.TextArea;
        } else if (controlType === 'Hidden') {
            this.controlTypeEnum = ControlTypeEnum.Hidden;
        } else if (controlType === 'Number') {
            this.controlTypeEnum = ControlTypeEnum.Number;
            this.value = +rawValue;
            this.defaultValue = +defaultValue;
        } else if (controlType === 'PhoneNumber') {
            this.controlTypeEnum = ControlTypeEnum.PhoneNumber;
        } else if (controlType === 'DateTime') {
            this.controlTypeEnum = ControlTypeEnum.DateTime;
            if (rawValue) {
                this.value = new Date(rawValue);
                this.defaultValue = new Date(defaultValue);
            }
        } else if (controlType === 'Duration') {
            this.controlTypeEnum = ControlTypeEnum.Duration;
            this.value = +rawValue;
            this.defaultValue = +defaultValue;
        } else if (controlType === 'Email') {
            this.controlTypeEnum = ControlTypeEnum.Email;    
        } else {
            this.controlTypeEnum = ControlTypeEnum.Unknown;
        }
    }
}

export class DropdownFieldOption implements IDropdownFieldOption {
    constructor(
        public value: string,
        public name: string,
        public extraDataJson?: any
    ) { }
}

export class FormFieldOptions implements IFormFieldOptions {

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
    public listOptions?: IDropdownFieldOption[];

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

    constructor(options: {
        maxLength?: number,
        minLength?: number,
        maxAutosizeRows?: number,
        minAutosizeRows?: number,
        listOptions?: DropdownFieldOption[],
        trueOptionLabel?: string,
        falseOptionLabel?: string,
        maxNumberValue?: number,
        minNumberValue?: number,
        extraTranslationData?: any,
        icon?: string
    }) {
        Object.assign(this, options);
    }
}
