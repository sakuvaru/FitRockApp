import { IErrorResponse, IFormErrorResponse } from './ierror-responses';
import { IFormValidationResult } from './iform-validation-result.interface';

export class ErrorResponse implements IErrorResponse {
    constructor(
        public error: string,
    ) {
    }
}

export class FormErrorResponse implements IFormErrorResponse {
    constructor(
        public error: string,
        public formValidation: IFormValidationResult
    ) {
    }
}
