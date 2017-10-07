export class DynamicFormStatus {
    constructor(
        public isValid: boolean,
        public isDeleteEnabled: boolean,
        public isEditForm: boolean,
        public isInsertForm: boolean,
    ) {}
}
