import { ControlTypeEnum } from '../models/control-type.enum';

export interface IFormField<T> {
    value: T;
    defaultValue: T;
    key: string;
    required: boolean;
    controlType: string;
    controlTypeEnum: ControlTypeEnum;
    options: IFormFieldOptions;
}

export interface IDropdownFieldOption {
    value: string;
    name: string;
}

export interface IFormFieldOptions {
    width: number;
    maxLength: number;
    minLength: number;
    maxAutosizeRows: number;
    minAutosizeRows: number;
    listOptions: IDropdownFieldOption[];
    trueOptionLabel: string;
    falseOptionLabel: string;
}