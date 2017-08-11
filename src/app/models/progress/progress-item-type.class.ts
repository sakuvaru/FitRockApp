import { BaseItem } from '../../../lib/repository';
import { ProgressItem } from './progress-item.class';

export class ProgressItemType extends BaseItem {

    public typeName: string;
    public isGlobal: boolean;
    public unit: string;

    public progressItems: ProgressItem[];
}

export class ProgressItemTypeWithCountDto extends ProgressItemType {
    public progressItemsCount: number;
}

