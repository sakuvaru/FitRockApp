import { IOption } from './ioption.class';

export class Page implements IOption {

    constructor(
        public page: number
    ) { }

    public GetParam(): string {
        return "page";
    }

    public GetParamValue(): string {
        return this.page.toString();
    }
}

export class Include implements IOption {

    constructor(
        public field: string
    ) { }

    public GetParam(): string {
        return "include";
    }

    public GetParamValue(): string {
        return this.field.trim();
    }
}

export class IncludeMultiple implements IOption {

    constructor(
        public fields: string[]
    ) { }

    public GetParam(): string {
        return "include";
    }

    public GetParamValue(): string {
        return this.fields.map(m => m).join('+');
    }
}

export class Limit implements IOption {

    constructor(
        public limit: number,
    ) { }

    public GetParam(): string {
        return "limit";
    }

    public GetParamValue(): string {
        return this.limit.toString();
    }
}

export class PageSize implements IOption {

    constructor(
        public pageSize: number,
    ) { }

    public GetParam(): string {
        return "pageSize";
    }

    public GetParamValue(): string {
        return this.pageSize.toString();
    }
}

export class OrderBy implements IOption {

    constructor(
        public field: string,
    ) { }

    public GetParam(): string {
        return "orderby." + this.field;
    }

    public GetParamValue(): string {
        return "asc";
    }
}

export class OrderByDescending implements IOption {

    constructor(
        public field: string,
    ) { }

    public GetParam(): string {
        return "orderby." + this.field;
    }

    public GetParamValue(): string {
        return "desc";
    }
}

export class WhereEquals implements IOption {
    constructor(
        public field: string,
        public value: string
    ) { }

    public GetParam(): string {
        return "whereequals." + this.field.trim();
    }

    public GetParamValue(): string {
        return this.value.trim();
    }
}

export class WhereLike implements IOption {
    constructor(
        public field: string,
        public value: string
    ) { }

    public GetParam(): string {
        return "wherelike." + this.field.trim();
    }

    public GetParamValue(): string {
        return this.value.trim();
    }
}

export class WhereLikeMultiple implements IOption {
    constructor(
        public fields: string[],
        public value: string
    ) { }

    public GetParam(): string {
        return "wherelike." + this.fields.map(m => m).join('+');
    }

    public GetParamValue(): string {
        return this.value.trim();
    }
}