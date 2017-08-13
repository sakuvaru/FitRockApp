import { BaseItem } from '../../../lib/repository';
import { ProgressItemType } from './progress-item-type.class';
import { User } from '../user.class';

export class ProgressItemUnit extends BaseItem {

    public unitCode: Date;

    public types: ProgressItemType[];
}