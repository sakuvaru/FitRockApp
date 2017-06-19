export interface IFormField<T> {
    value: T;
    defaultValue: T;
    key: string;
    required: boolean;
    controlType: string;
    maxLength: number;
    minLength: number;
    maxAutosizeRows: number;
    minAutosizeRows: number;
    width: number;
    dropdownOptions: IDropdownFieldOption[];
    trueOptionLabel: string;
    falseOptionLabel: string;
    keyAlias: string;
}

export interface IDropdownFieldOption {
    value: string;
    name: string;
}