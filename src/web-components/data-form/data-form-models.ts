import { IDataFormDefinition, IDataFormField } from './data-form.interfaces';

export class DataFormField implements IDataFormField {

    /**
     * Value of the field
     */
    public value: string | boolean | Date | number;

    constructor(
        /**
         * Key of the field (i.e. column name)
         */
        public key: string,
        public required: boolean
    ) {}
}

export class DataFormEditDefinition implements IDataFormDefinition {
    constructor(
        public fields: IDataFormField[]
    ) {}
}

export class DataFormInsertDefinition implements IDataFormDefinition {
    constructor(
        public fields: IDataFormField[]
    ) {}
}

export class DataFormEditResponse {

}

export class DataFormInsertResponse {

}

export class DataFormDeleteResponse {

}
