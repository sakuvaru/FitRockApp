import { processParamValue } from 'lib/repository/helpers/process-param-value';

export class QueryConditionField {
    constructor(
        public name: string,
        public value: string | number | boolean | Date | undefined,
        public type: QueryConditionType
    ) { }
}

export enum QueryConditionType {
    Like = 'like',
    GreaterThan = 'greaterThan',
    LessThan = 'lessThan',
    NotEquals = 'notEquals',
    Equals = 'equals',
    WhereNull = 'whereNull',
    WhereNotNull = 'whereNotNull'
}

export enum QueryConditionJoin {
    And = 'and',
    Or = 'or'
}

export class QueryCondition {

    private readonly conditionWrap = '-c-';
    private readonly fieldWrap = '-f-';
    private readonly fieldParamSeparator = '-v-';
    private readonly conditionJoinWrap = '-j-';

    public leftSide: QueryConditionField[] | QueryCondition;
    public rightSide: QueryConditionField[] | QueryCondition;
    public join: QueryConditionJoin;

    constructor(
        data: {
            leftSide: QueryConditionField[] | QueryCondition,
            rightSide: QueryConditionField[] | QueryCondition,
            join: QueryConditionJoin
        }
    ) {
        Object.assign(this, data);
    }

    getUrlParamValue(): string {
        return this.getCondition(this.leftSide, this.rightSide, this.join);
    }

    private getCondition(leftSide: QueryConditionField[] | QueryCondition, rightSide: QueryConditionField[] | QueryCondition, join: QueryConditionJoin): string {
        // start condition
        let condition: string = this.conditionWrap;

        // add let side
        if (Array.isArray(leftSide) && leftSide) {
            if (leftSide.length === 0) {
                throw Error(`Empty left condition`);
            }

            leftSide.forEach(field => {
                condition += this.getFieldParam(field);
            });
        } else if (leftSide instanceof QueryCondition) {
            // recursively resolve condition
            condition += this.getCondition(leftSide.leftSide, leftSide.rightSide, leftSide.join);
        } else {
            throw Error('Unsupported left condition');
        }

        // add join param
        condition += `${this.conditionJoinWrap}${join.toString()}${this.conditionJoinWrap}`;

        // add right side
        if (Array.isArray(rightSide) && rightSide) {
            if (rightSide.length === 0) {
                throw Error(`Empty right condition`);
            }

            rightSide.forEach(field => {
                condition += this.getFieldParam(field);
            });
        } else if (rightSide instanceof QueryCondition) {
            // recursively resolve condition
            condition += this.getCondition(rightSide.leftSide, rightSide.rightSide, rightSide.join);
        } else {
            throw Error('Unsupported right condition');
        }

        // wrap end condition
        condition += this.conditionWrap;

        return condition;
    }

    private getFieldParam(field: QueryConditionField): string {
        return `${this.fieldWrap}${field.name}${this.fieldParamSeparator}${field.type.toString()}${this.fieldParamSeparator}${processParamValue(field.value)}${this.fieldWrap}`;
    }
}

