import { IPropertyInfo } from './iproperty-info.interface';

export interface IItem {
    type: string;
    id: number;
    codename: string;
    guid: string;
    created: Date;
    updated: Date;
    itemProperties: IPropertyInfo[];

    resolver?: ((fieldName: string) => string);
}
