import { IFormValidationResult } from '../interfaces/iform-validation-result.interface';
import { FormValidationResultEnum } from '../enums/form-validation-result.enum';

export class FormValidationResult {

    public validationResult: FormValidationResultEnum;

    constructor(
        private resultKey: string,
        public message: string,
        public isInvalid: boolean,
        public messageKey?: string,
        public column?: string,
    ) {
        if (resultKey === 'Valid') {
            this.validationResult = FormValidationResultEnum.Valid;
        } else if (resultKey === 'NotUnique') {
            this.validationResult = FormValidationResultEnum.NotUnique;
        } else if (resultKey === 'InvalidCodename') {
            this.validationResult = FormValidationResultEnum.InvalidCodename;
        } else if (resultKey === 'InvalidEmail') {
            this.validationResult = FormValidationResultEnum.InvalidEmail;
        } else if (resultKey === 'NotEditable') {
            this.validationResult = FormValidationResultEnum.NotEditable;
        } else if (resultKey === 'OneRecordPerDay') {
            this.validationResult = FormValidationResultEnum.OneRecordPerDay;
        } else if (resultKey === 'CustomWithMessageKey') {
            this.validationResult = FormValidationResultEnum.CustomWithMessageKey;
        } else if (resultKey === 'ConstraintConflict') {
            this.validationResult = FormValidationResultEnum.ConstraintConflict;
        } else if (resultKey === 'FormLoadingError') {
            this.validationResult = FormValidationResultEnum.FormLoadingError;
        } else if (resultKey === 'Other') {
            this.validationResult = FormValidationResultEnum.Other;
        } else {
            this.validationResult = FormValidationResultEnum.Other;
        }
    }
}
