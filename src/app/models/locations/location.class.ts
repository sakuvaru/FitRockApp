import { BaseItem } from '../../../lib/repository';
import { User } from '../user.class';

export class Location extends BaseItem {

    public locationName: string;
    public address: string;
    public city: string;
    public lat: number | null;
    public lng: number | null;
    public locationType: number;
    public locationTypeAsString: string;

}
