import { IOption } from '../interfaces/ioption.interface';
import { FieldValue } from './field-value.class';
import { QueryCondition, QueryConditionField, QueryConditionJoin, QueryConditionType} from '../models/query-conditions';
import { processParamValue } from 'lib/repository/helpers/process-param-value';


export class CustomOption implements IOption {
    constructor(
        public optionName: string,
        public optionValue: string | boolean | number | Date | undefined
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
        return 'orderbyasc';
    }

    public GetParamValue(): string {
        return this.field;
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
        return 'orderbydesc';
    }

    public GetParamValue(): string {
        return this.field;
    }
}

export class WhereComplex implements IOption {

    public condition: QueryCondition;

    public leftSide: QueryCondition | QueryConditionField[];
    public rightSide: QueryCondition | QueryConditionField[];
    public join: QueryConditionJoin;

    constructor(data: {
         leftSide: QueryCondition | QueryConditionField[],
         rightSide: QueryCondition | QueryConditionField[],
         join: QueryConditionJoin
    }
    ) {
        if (!data.leftSide || !data.rightSide || !data.join) {
            throw Error(`Missing data for Where condition`);
        }

        this.condition = new QueryCondition({
            leftSide: data.leftSide,
            rightSide: data.rightSide, 
            join: data.join
        });
    }

    public GetParam(): string {
        return 'whereComplex';
    }

    public GetParamValue(): string {
        return processParamValue(this.condition.getUrlParamValue());
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

export class WhereEqualsWithOr implements IOption {
    constructor(
        public conditions: FieldValue[]
    ) {
        if (!conditions || conditions.length === 0) {
            throw Error(`Conditions cannot be empty`);
        }
    }

    public GetParam(): string {
        return 'whereequalswithor.' + this.conditions.map(m => m.field).join('+');
    }

    public GetParamValue(): string {
        return this.conditions.map(m => processParamValue(m.value)).join('+');
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

    public GetParamValue(): string | undefined {
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

    public GetParamValue(): string | undefined {
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

export class WhereGreaterThan implements IOption {
    constructor(
        public field: string,
        public value: number | Date
    ) {
        if (!field) {
            throw Error(`Field cannot be null in 'WhereGreaterThan' otion`);
        }
    }

    public GetParam(): string {
        return 'wheregreaterthan.' + this.field.trim();
    }

    public GetParamValue(): string | undefined {
        if (this.value instanceof Date) {
            return processParamValue(this.value.toUTCString());
        }
        return processParamValue(this.value);
    }
}

export class WhereLessThan implements IOption {
    constructor(
        public field: string,
        public value: number | Date
    ) {
        if (!field) {
            throw Error(`Field cannot be null in 'WhereLessThan' otion`);
        }
    }

    public GetParam(): string {
        return 'wherelessthan.' + this.field.trim();
    }

    public GetParamValue(): string | undefined {
        if (this.value instanceof Date) {
            return processParamValue(this.value.toUTCString());
        }
        return processParamValue(this.value);
    }
}


