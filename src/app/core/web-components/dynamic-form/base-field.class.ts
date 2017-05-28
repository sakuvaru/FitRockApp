import { DropdownFieldOption } from './models';

export class BaseField<T>{
    public value: T;
    public key: string;
    public label: string;
    public required: boolean;
    public controlType: string;
    public maxLength: number;
    public minLength: number;
    public hint: string;
    public maxAutosizeRows: number;
    public minAutosizeRows: number;
    public width: number;
    public dropdownOptions: DropdownFieldOption[];
    public trueOptionLabel: string;
    public falseOptionLabel: string;
    constructor(options: {
        value?: T,
        key?: string,
        label?: string,
        required?: boolean,
        controlType?: string,
        maxLength?: number,
        minLength?: number,
        hint?: string,
        maxAutosizeRows?: number,
        minAutosizeRows?: number,
        width?: number,
        dropdownOptions?: DropdownFieldOption[],
        trueOptionLabel?: string,
        falseOptionLabel?: string
    }) {
        Object.assign(this, options);
    }
}