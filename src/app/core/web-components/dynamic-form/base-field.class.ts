export class BaseField<T>{
    value: T;
    key: string;
    label: string;
    required: boolean;
    controlType: string;
    maxLength: number;
    minLength: number;
    hint: string;
    maxAutosizeRows: number;
    minAutosizeRows: number;
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
        minAutosizeRows?: number
    } = {}) {
        this.value = options.value;
        this.key = options.key || '';
        this.label = options.label || '';
        this.required = !!options.required;
        this.controlType = options.controlType || '';
        this.minLength = options.minLength;
        this.maxLength = options.maxLength;
        this.hint = options.hint;
        this.maxAutosizeRows = options.maxAutosizeRows || 10;
        this.minAutosizeRows = options.minAutosizeRows || 3
    }
}