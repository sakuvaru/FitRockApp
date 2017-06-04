import { FieldErrorEnum } from '../models/field-error.enum';

export interface IColumnValidation {
    errorType: FieldErrorEnum;
    columnName: string;
    result: number;
}