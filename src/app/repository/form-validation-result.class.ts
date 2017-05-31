import { IColumnValidation } from './icolumn-validation.interface';
import { IFormValidationResult } from './iform-validation-result.interface';

export class FormValidationResult implements IFormValidationResult {
    constructor(
        public validationResult: IColumnValidation[]
    )
    { }
}