import { ControlTypeEnum } from '../models/control-type.enum';

export interface IFormField {
    
    /**
     * Raw value of the field
     */
    rawValue?: any;

    /**
     * Value of the field converted to fields proper type (i.e. boolean, integer, Date) where applicable
     */
    value?: any;

    /**
     * Default value of the field
     */
    defaultValue?: any;

    /**
     * Key of the field (= property name/column)
     */
    key: string;

    /**
     * Indicates if field is required
     */
    required: boolean;

    /**
     * Control type that is used to render the field in form (e.g. checkbox, radiobutton, textarea..)
     */
    controlType: string;

    /**
     * Strongly typed Control type
     */
    controlTypeEnum: ControlTypeEnum;

    /**
     * Additional field options
     */
    options?: IFormFieldOptions;

    /**
     * Translated field name label
     */
    translatedLabel?: string;
}

export interface IDropdownFieldOption {
    /**
     * Value of the dropdown field (this will be stored in db)
     */
    value: string;

    /**
     * Display name or translation key
     */
    name: string;

    /**
     * Json with extra data
     */
    extraDataJson?: any;
}

export interface IFormFieldOptions {
    /**
      * Width of the field. Applied for dropdown list
      */
    width?: number;

    /**
     * Maximum length of field (characters)
     */
    maxLength?: number;

    /**
     * Minimum length of field (characters)
     */
    minLength?: number;

    /**
     * Maximum number of rows in case of textarea
     */
    maxAutosizeRows?: number;

    /**
     * Minimum number of rows in case of textarea
     */
    minAutosizeRows?: number;

    /**
     * List of options in case of dropdown list
     */
    listOptions?: IDropdownFieldOption[];

    /**
     * Label of 'true' option in case of radio check box
     */
    trueOptionLabel?: string;

    /**
     * Label of 'false' option in case of radio check box
     */
    falseOptionLabel?: string;

    /**
     * Maximum number value
     */
    maxNumberValue?: number;

    /**
     * Minimum number value
     */
    minNumberValue?: number;

    /**
     * Used for passing extra data to translation
     */
    extraTranslationData?: any;
}