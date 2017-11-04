
/**
 * Change also 'form-validation-result.class' when modifying this enum
 */
export enum FormValidationResultEnum {
    Valid,
    NotUnique,
    InvalidCodename,
    InvalidEmail,
    Other,
    NotEditable,
    OneRecordPerDay,
    CustomWithMessageKey,
    ConstraintConflict,
    FormLoadingError
}
