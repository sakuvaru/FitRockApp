import { QueryService } from 'lib/repository/services/query.service';

import { IOption } from '../../interfaces/ioption.interface';
import { FieldValue } from '../../models/field-value.class';
import * as Options from '../../models/options';
import { QueryCondition, QueryConditionField, QueryConditionJoin } from '../../models/query-conditions';
import { BaseQuery } from '../base-query.class';

export abstract class BaseItemQuery extends BaseQuery {

    protected _options: IOption[] = [];
    protected _action: string;

    abstract get(): any;

    constructor(
        protected queryService: QueryService,
        protected type: string,
    ) {
        super(queryService);
    }

    // options

    getOptions(): IOption[] {
        return this._options;
    }

    resetOptions(): this {
        this._options = [];
        return this;
    }

    orderBy(field: string): this {
        this._options.push(new Options.OrderBy(field));
        return this;
    }

    orderByDescending(field: string): this {
        this._options.push(new Options.OrderByDescending(field));
        return this;
    }

    disableCache(disableCache: boolean): this {
        this._options.push(new Options.DisableCache(disableCache));
        return this;
    }

    include(field: string): this {
        this._options.push(new Options.Include(field));
        return this;
    }

    includeMultiple(fields: string[]): this {
        this._options.push(new Options.IncludeMultiple(fields));
        return this;
    }

    whereEquals(field: string, value: string | number | boolean): this {
        this._options.push(new Options.WhereEquals(field, value));
        return this;
    }

    whereComplex(data: {
        leftSide: QueryCondition | QueryConditionField[],
        rightSide: QueryCondition | QueryConditionField[],
        join: QueryConditionJoin
    }): this {
        this._options.push(new Options.WhereComplex(data));
        return this;
    }

    whereEqualsWithOr(conditions: FieldValue[]): this {
        this._options.push(new Options.WhereEqualsWithOr(conditions));
        return this;
    }

    whereNotEquals(field: string, value: string | number | boolean): this {
        this._options.push(new Options.WhereNotEquals(field, value));
        return this;
    }

    whereEmpty(field: string): this {
        this._options.push(new Options.WhereEmpty(field));
        return this;
    }

    whereLike(field: string, value: string | number | boolean): this {
        this._options.push(new Options.WhereLike(field, value));
        return this;
    }

    whereLikeMultiple(fields: string[], value: string | number | boolean): this {
        this._options.push(new Options.WhereLikeMultiple(fields, value));
        return this;
    }

    whereNull(field: string): this {
        this._options.push(new Options.WhereNull(field));
        return this;
    }

    whereNullMultiple(fields: string[]): this {
        this._options.push(new Options.WhereNullMultiple(fields));
        return this;
    }

    whereNotNull(field: string): this {
        this._options.push(new Options.WhereNotNull(field));
        return this;
    }

    whereNotNullMultiple(fields: string[]): this {
        this._options.push(new Options.WhereNotNullMultiple(fields));
        return this;
    }

    whereGreaterThan(field: string, value: number | Date): this {
        this._options.push(new Options.WhereGreaterThan(field, value));
        return this;
    }

    whereLessThen(field: string, value: number | Date): this {
        this._options.push(new Options.WhereLessThan(field, value));
        return this;
    }

    protected getSingleItemQueryUrl(): string {
        return this.queryService.getTypeUrl(this.type, this._action, this._options);
    }

    protected getMultipleItemsQueryUrl(): string {
        return this.queryService.getTypeUrl(this.type, this._action, this._options);
    }
}
