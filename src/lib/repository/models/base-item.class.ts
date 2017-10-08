import { IItem } from '../interfaces/iitem.interface';
import { IPropertyInfo } from '../interfaces/iproperty-info.interface';

export abstract class BaseItem implements IItem {
    public type: string;
    public id: number;
    public codename: string;
    public guid: string;
    public created: Date;
    public updated: Date;
    public itemProperties: IPropertyInfo[];

    public createdByUserId?: number;
    public updatedByUserId?: number;

    public createdByUser?: any;
    public updatedByUser?: any;

    public resolver?: ((fieldName: string) => string);

    constructor(
        public options?: {
            resolver?: ((fieldName: string) => string)
        }) {
        if (options) {
            Object.assign(this, options);
        }
    }
}
