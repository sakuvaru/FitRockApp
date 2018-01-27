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
    MapBoxConfig,
    NumberBoxConfig,
} from '../../../web-components/boxes';
import { TextAlignEnum } from 'web-components';

export class BoxService {

    infoBox(
        lines: Observable<InfoBoxLine[]>,
        title: Observable<string>,
        titleAlign: TextAlignEnum,
        options?: {
            noDataMessage?: Observable<string>,
            actions?: ActionButton[]
        }
    ): InfoBoxConfig {
        return new InfoBoxConfig(lines, title, titleAlign, options);
    }

    listBox(
        items: Observable<ListBoxItem[]>,
        title: Observable<string>,
        titleAlign: TextAlignEnum,
        options?: {
            noDataMessage?: Observable<string>,
            actions?: ActionButton[]
        }
    ): ListBoxConfig {
        return new ListBoxConfig(items, title, titleAlign, options);
    }

    miniBox(
        title: Observable<string>,
        text: Observable<string>,
        titleAlign: TextAlignEnum,
        color: BoxColors
    ): MiniBoxConfig {
        return new MiniBoxConfig(title, titleAlign, text, color);
    }

    numberBox(
        number: Observable<number>,
        text: Observable<string>,
        color: BoxColors,
        startNumber: number = 0,
        options?: {
            animate?: boolean
        }
    ): NumberBoxConfig {
        return new NumberBoxConfig(number, text, color, startNumber, options);
    }

    tableBox(
        title: Observable<string>,
        titleAlign: TextAlignEnum,
        lines: Observable<TableBoxLine[]>,
    ): TableBoxConfig {
        return new TableBoxConfig(title, titleAlign, lines);
    }

    mapBox(
        title: Observable<string>,
        titleAlign: TextAlignEnum,
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
        return new MapBoxConfig(title, titleAlign, apiKey, address, lat, lng, options);
    }

}
