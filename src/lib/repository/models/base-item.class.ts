import { IItem } from '../interfaces/iitem.interface';

export abstract class BaseItem implements IItem {
    public type: string;
    public id: number;
    public codename: string;
    public guid: string;
    public created: Date;
    public updated: Date;

    public createdByUserId?: number;
    public updatedByUserId?: number;

    public resolver?: ((fieldName: string) => string);

    constructor(
        public options?: {
            resolver?: ((fieldName: string) => string)
        }) {
        if (options) Object.assign(this, options);
    }
}
