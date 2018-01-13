import { Observable } from 'rxjs/Rx';

import {
    ActionButton,
    BoxColors,
    InfoBoxConfig,
    InfoBoxLine,
    ListBoxConfig,
    ListBoxItem,
    MiniBoxConfig,
    TableBoxLine,
    TableBoxConfig,
    MapBoxConfig
} from '../../../web-components/boxes';

export class BoxService {

    infoBox(
        lines: Observable<InfoBoxLine[]>,
        title: Observable<string>,
        options?: {
            noDataMessage?: Observable<string>,
            actions?: ActionButton[]
        }
    ): InfoBoxConfig {
        return new InfoBoxConfig(lines, title, options);
    }

    listBox(
        items: Observable<ListBoxItem[]>,
        title: Observable<string>,
        options?: {
            noDataMessage?: Observable<string>,
            actions?: ActionButton[]
        }
    ): ListBoxConfig {
        return new ListBoxConfig(items, title, options);
    }

    miniBox(
         title: Observable<string>,
         text: Observable<string>,
         color: BoxColors
    ): MiniBoxConfig {
        return new MiniBoxConfig(title, text, color);
    }

    tableBox(
         title: Observable<string>,
         lines: Observable<TableBoxLine[]>,
    ): TableBoxConfig {
        return new TableBoxConfig(title, lines);
    }

    mapBox(
         title: Observable<string>,
         apiKey: string,
         address: string,
         lat?: number,
         lng?: number,
         options?: {
            zoom?: number,
            noDataMessage?: Observable<string>,
            actions?: ActionButton[]
        }
   ): MapBoxConfig {
       return new MapBoxConfig(title, apiKey, address, lat, lng, options);
   }

}
