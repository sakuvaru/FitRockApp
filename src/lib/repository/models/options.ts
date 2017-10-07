import { IOption } from '../interfaces/ioption.interface';

export class CustomOption implements IOption {
    constructor(
        public optionName: string,
        public optionValue: string | boolean | number | Date
    ) {
        if (!optionName) {
            throw Error(`Option name cannot be empty`);
        }
    }

    public GetParam(): string {
        return this.optionName;
    }

    public GetParamValue(): string {
        return processParamValue(this.optionValue);
    }
}

export class DisableCache implements IOption {

    constructor(
        public disableCache: boolean
    ) { }

    public GetParam(): string {
        return 'disableCache';
    }

    public GetParamValue(): string {
        return processParamValue(this.disableCache);
    }
}

export class Page implements IOption {

    constructor(
        public page: number
    ) {
        if (!page) {
            throw Error(`Page cannot be empty`);
        }
    }

    public GetParam(): string {
        return 'page';
    }

    public GetParamValue(): string {
        return this.page.toString();
    }
}

export class Include implements IOption {

    constructor(
        public field: string
    ) {
        if (!field) {
            throw Error(`Fields cannot be null in 'Include' otion`);
        }
    }

    public GetParam(): string {
        return 'include';
    }

    public GetParamValue(): string {
        return this.field.trim();
    }
}

export class IncludeMultiple implements IOption {

    constructor(
        public fields: string[]
    ) {
        if (!fields) {
            throw Error(`Fields cannot be null in 'IncludeMultiple' otion`);
        }
    }

    public GetParam(): string {
        return 'include';
    }

    public GetParamValue(): string {
        return this.fields.map(m => m).join('+');
    }
}

export class Limit implements IOption {

    constructor(
        public limit: number,
    ) {
        if (!limit) {
            throw Error(`Limit cannot be empty`);
        }
    }

    public GetParam(): string {
        return 'limit';
    }

    public GetParamValue(): string {
        return this.limit.toString();
    }
}

export class PageSize implements IOption {

    constructor(
        public pageSize: number,
    ) {
        if (!pageSize) {
            throw Error(`Page size cannot be empty`);
        }
    }

    public GetParam(): string {
        return 'pageSize';
    }

    public GetParamValue(): string {
        return this.pageSize.toString();
    }
}

export class OrderBy implements IOption {

    constructor(
        public field: string,
    ) {
        if (!field) {
            throw Error(`Fields cannot be null in 'OrderBy' otion`);
        }
    }

    public GetParam(): string {
        return 'orderby.' + this.field;
    }

    public GetParamValue(): string {
        return 'asc';
    }
}

export class OrderByDescending implements IOption {

    constructor(
        public field: string,
    ) {
        if (!field) {
            throw Error(`Fields cannot be null in 'OrderByDescending' otion`);
        }
    }

    public GetParam(): string {
        return 'orderby.' + this.field;
    }

    public GetParamValue(): string {
        return 'desc';
    }
}

export class WhereEquals implements IOption {
    constructor(
        public field: string,
        public value: string | number | boolean
    ) {
        if (!field) {
            throw Error(`Field cannot be null in 'WhereEquals' otion`);
        }
    }

    public GetParam(): string {
        return 'whereequals.' + this.field.trim();
    }

    public GetParamValue(): string {
        return processParamValue(this.value);
    }
}

export class WhereEmpty implements IOption {
    constructor(
        public field: string,
    ) {
        if (!field) {
            throw Error(`Field cannot be null in 'WhereEmpty' otion`);
        }
    }

    public GetParam(): string {
        return 'whereequals.' + this.field.trim();
    }

    public GetParamValue(): string {
        return '';
    }
}

export class WhereLike implements IOption {
    constructor(
        public field: string,
        public value: string | number | boolean
    ) {
        if (!field) {
            throw Error(`Field cannot be null in 'WhereEquals' otion`);
        }
    }

    public GetParam(): string {
        return 'wherelike.' + this.field.trim();
    }

    public GetParamValue(): string {
        return processParamValue(this.value);
    }
}

export class WhereLikeMultiple implements IOption {
    constructor(
        public fields: string[],
        public value: string | number | boolean
    ) {
        if (!fields) {
            throw Error(`Fields cannot be null in 'WhereLikeMultiple' otion`);
        }
    }

    public GetParam(): string {
        return 'wherelike.' + this.fields.map(m => m).join('+');
    }

    public GetParamValue(): string {
        return processParamValue(this.value);
    }
}

export class WhereNotEquals implements IOption {
    constructor(
        public field: string,
        public value: string | number | boolean
    ) {
        if (!field) {
            throw Error(`Field cannot be null in 'WhereNotEquals' otion`);
        }
    }

    public GetParam(): string {
        return 'wherenotequals.' + this.field.trim();
    }

    public GetParamValue(): string {
        return processParamValue(this.value);
    }
}

export class WhereNull implements IOption {

    constructor(
        public field: string
    ) {
        if (!field) {
            throw Error(`Fields cannot be null in 'WhereNull' otion`);
        }
    }

    public GetParam(): string {
        return 'wherenull';
    }

    public GetParamValue(): string {
        return this.field.trim();
    }
}

export class WhereNullMultiple implements IOption {

    constructor(
        public fields: string[]
    ) {
        if (!fields) {
            throw Error(`Fields cannot be null in 'WhereNullMultiple' otion`);
        }
    }

    public GetParam(): string {
        return 'wherenull';
    }

    public GetParamValue(): string {
        return this.fields.map(m => m).join('+');
    }
}

export class WhereNotNull implements IOption {

    constructor(
        public field: string
    ) {
        if (!field) {
            throw Error(`Fields cannot be null in 'WhereNotNull' otion`);
        }
    }

    public GetParam(): string {
        return 'wherenotnull';
    }

    public GetParamValue(): string {
        return this.field.trim();
    }
}

export class WhereNotNullMultiple implements IOption {

    constructor(
        public fields: string[]
    ) {
        if (!fields) {
            throw Error(`Fields cannot be null in 'WhereNotNullMultiple' otion`);
        }
    }

    public GetParam(): string {
        return 'wherenotnull';
    }

    public GetParamValue(): string {
        return this.fields.map(m => m).join('+');
    }
}

/**
 * Gets proper 'string' value of string, number or boolean value
 * @param value Value to be processed
 */
function processParamValue(value: string | number | boolean | Date): string {
    if (!value) {
        if (typeof (value) === 'boolean') {
            return 'false';
        }
        return '';
    }
    return value.toString().trim();
}
