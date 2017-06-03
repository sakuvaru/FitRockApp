import { IColumnValidation } from '../interfaces/icolumn-validation.interface';
import { IFormValidationResult } from '../interfaces/iform-validation-result.interface';

export class FormValidationResult implements IFormValidationResult {
    constructor(
        public message: string,
        public validationResult: IColumnValidation[]
    )
    { }
}