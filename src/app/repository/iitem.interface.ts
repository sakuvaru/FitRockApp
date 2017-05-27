export interface IItem {
    type: string;
    id: number;
    codename: string;
    guid: string;
    created: Date;
    updated: Date;

    resolver?: ((fieldName: string) => string);
}