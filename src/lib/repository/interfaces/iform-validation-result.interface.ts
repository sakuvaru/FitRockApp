import { IColumnValidation } from './icolumn-validation.interface';

export interface IFormValidationResult {
    message: string;
    validationResult: IColumnValidation[],
    isInvalid: boolean;

}