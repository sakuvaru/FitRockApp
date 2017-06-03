import { IFormValidationResult } from './iform-validation-result.interface';

export interface IErrorResponse{
    error: string;
}

export interface IFormErrorResponse extends IErrorResponse{
    formValidation: IFormValidationResult;
}