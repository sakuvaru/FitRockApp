import { BaseItem } from '../../../lib/repository';
import { ProgressItem } from './progress-item.class';
import { ProgressItemUnit } from './progress-item-unit.class';
import { User } from '../user.class';

export class ProgressItemType extends BaseItem {

    public translateValue: boolean;
    public typeName: string;
    public isGlobal: boolean;
    public progressItemUnitId: number;
    public clientId?: number;

    public progressItemUnit: ProgressItemUnit;
    public progressItems: ProgressItem[];
    public client: User;
}

export class ProgressItemTypeWithCountDto {

    public id: number;
    public codename: string;
    public typeName: string;
    public isGlobal: boolean;
    public ClientId?: number;
    public translateValue: boolean;
    public progressItemsCount: number;
}

