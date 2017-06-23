import { ControlTypeEnum } from './control-type.enum';
import { IDropdownFieldOption, IFormField, IFormFieldOptions } from '../interfaces/iform-fields';

export class BaseField<T> implements IFormField<T> {
    public value: T;
    public defaultValue: T;
    public key: string;
    public required: boolean;
    public controlType: string;
    public controlTypeEnum: ControlTypeEnum;
    public options: IFormFieldOptions;
    public translatedLabel: string;

    constructor(constructorOptions: {
        value?: T,
        defaultValue?: T,
        key?: string,
        required?: boolean,
        controlType?: string,
        options?: IFormFieldOptions
    }) {
        Object.assign(this, constructorOptions);

        if (this.controlType) {
            this.mapControlType(this.controlType);
        }
    }

    private mapControlType(controlType: string): void {
        if (controlType === 'None') {
            this.controlTypeEnum = ControlTypeEnum.None;
        }
        else if (controlType === 'Dropdown') {
            this.controlTypeEnum = ControlTypeEnum.Dropdown;
        }
        if (controlType === 'Date') {
            this.controlTypeEnum = ControlTypeEnum.Date;
        }
        else if (controlType === 'Boolean') {
            this.controlTypeEnum = ControlTypeEnum.Boolean;
        }
        if (controlType === 'RadioBoolean') {
            this.controlTypeEnum = ControlTypeEnum.RadioBoolean;
        }
        else if (controlType === 'Text') {
            this.controlTypeEnum = ControlTypeEnum.Text;
        }
        if (controlType === 'TextArea') {
            this.controlTypeEnum = ControlTypeEnum.TextArea;
        }
        else if (controlType === 'Hidden') {
            this.controlTypeEnum = ControlTypeEnum.Hidden;
        }
    }
}

export class DropdownFieldOption implements IDropdownFieldOption {
    constructor(
        public value: string,
        public name: string
    ) { }
}

export class FormFieldOptions implements IFormFieldOptions {
    public width: number;
    public maxLength: number;
    public minLength: number;
    public maxAutosizeRows: number;
    public minAutosizeRows: number;
    public listOptions: IDropdownFieldOption[];
    public trueOptionLabel: string;
    public falseOptionLabel: string;

    constructor(options: {
        maxLength?: number,
        minLength?: number,
        maxAutosizeRows?: number,
        minAutosizeRows?: number,
        width?: number,
        listOptions?: DropdownFieldOption[],
        trueOptionLabel?: string,
        falseOptionLabel?: string,
    }) {
        Object.assign(this, options);
    }
}