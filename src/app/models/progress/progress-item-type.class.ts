import { BaseItem } from '../../../lib/repository';
import { ProgressItem } from './progress-item.class';
import { ProgressItemUnit } from './progress-item-unit.class';

export class ProgressItemType extends BaseItem {

    public typeName: string;
    public isGlobal: boolean;
    public progressItemUnitId: number;

    public progressItemUnit: ProgressItemUnit;
    public progressItems: ProgressItem[];
}

export class ProgressItemTypeWithCountDto extends ProgressItemType {
    public progressItemsCount: number;
}

