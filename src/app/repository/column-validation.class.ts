import { IColumnValidation } from './icolumn-validation.interface';

export class ColumnValidation implements IColumnValidation {
    constructor(
        public columnName: string,
        public result: number
    ) { }

}