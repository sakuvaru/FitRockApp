import { ControlTypeEnum } from './control-type.enum';

export class BaseField<T>{
    public value: T;
    public defaultValue: T;
    public key: string;
    public required: boolean;
    public controlType: number;
    public controlTypeEnum: ControlTypeEnum;
    public maxLength: number;
    public minLength: number;
    public maxAutosizeRows: number;
    public minAutosizeRows: number;
    public width: number;
    public dropdownOptions: DropdownFieldOption[];
    public trueOptionLabel: string;
    public falseOptionLabel: string;
    public keyAlias: string;
    constructor(options: {
        value?: T,
        defaultValue?: T,
        key?: string,
        required?: boolean,
        controlType?: number,
        maxLength?: number,
        minLength?: number,
        maxAutosizeRows?: number,
        minAutosizeRows?: number,
        width?: number,
        dropdownOptions?: DropdownFieldOption[],
        trueOptionLabel?: string,
        falseOptionLabel?: string,
        keyAlias?: string
    }) {
        Object.assign(this, options);

        if (this.controlType) {
            this.mapControlType(this.controlType);
        }
    }

    private mapControlType(controlType: number): void {
        if (controlType === 0) {
            this.controlTypeEnum = ControlTypeEnum.None;
        }
        else if (controlType === 1) {
            this.controlTypeEnum = ControlTypeEnum.Dropdown;
        }
        if (controlType === 2) {
            this.controlTypeEnum = ControlTypeEnum.Date;
        }
        else if (controlType === 3) {
            this.controlTypeEnum = ControlTypeEnum.Boolean;
        }
        if (controlType === 4) {
            this.controlTypeEnum = ControlTypeEnum.RadioBoolean;
        }
        else if (controlType === 5) {
            this.controlTypeEnum = ControlTypeEnum.Text;
        }
        if (controlType === 6) {
            this.controlTypeEnum = ControlTypeEnum.TextArea;
        }
        else if (controlType === 7) {
            this.controlTypeEnum = ControlTypeEnum.Hidden;
        }
    }
}

export class DropdownFieldOption {
    constructor(
        public value: string,
        public name: string
    ) { }
}