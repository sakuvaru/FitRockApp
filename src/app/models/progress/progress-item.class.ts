import { BaseItem } from '../../../lib/repository';
import { ProgressItemType } from './progress-item-type.class';
import { User } from '../user.class';

export class ProgressItem extends BaseItem {

    public measurementDate: Date;
    public clientId: number;
    public progressItemTypeId: number;
    public value: number;

    public client: User;
    public progressItemType: ProgressItemType;
}
