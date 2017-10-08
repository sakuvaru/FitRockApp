import { IColumnValidation } from '../interfaces/icolumn-validation.interface';
import { FieldErrorEnum } from './field-error.enum';

export class ColumnValidation implements IColumnValidation {

    public errorType: FieldErrorEnum;

    constructor(
        public columnName: string,
        public result: number
    ) {
        if (result === 1) {
            this.errorType = FieldErrorEnum.NotUnique;
        } else if (result === 2) {
            this.errorType = FieldErrorEnum.InvalidCodename;
        } else if (result === 3) {
            this.errorType = FieldErrorEnum.InvalidEmail;
        } else if (result === 4) {
            this.errorType = FieldErrorEnum.NotEditable;
        } else if (result === 50) {
            this.errorType = FieldErrorEnum.Other;
        } else {
            this.errorType = FieldErrorEnum.Unknown;
        }
    }

}
