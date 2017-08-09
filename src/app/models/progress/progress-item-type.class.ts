import { BaseItem } from '../../../lib/repository';
import { ProgressItem } from './progress-item.class';

export class ProgressItemType extends BaseItem {

    public typeName: string;

    public progressItems: ProgressItem[];
}