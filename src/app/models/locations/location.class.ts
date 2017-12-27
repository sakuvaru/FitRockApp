import { BaseItem } from '../../../lib/repository';
import { User } from '../user.class';

export class Location extends BaseItem {

    public locationName: string;
    public address: string;
    public lat: number | undefined;
    public lng: number | undefined;
    public locationType: number;
    public locationTypeAsString: string;

}
