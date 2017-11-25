
export interface IDataFormField {
    key: string;
    value: string | boolean | number | Date;
    required: boolean;
}

export interface IDataFormDefinition {
    fields: IDataFormField[];
}
