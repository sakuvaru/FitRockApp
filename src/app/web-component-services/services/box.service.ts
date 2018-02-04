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
        options?: {
            noDataMessage?: Observable<string>,
            actions?: ActionButton[],
            title?: Observable<string>,
            titleAlign?: TextAlignEnum,
            wrapInCard?: boolean
        }
    ): InfoBoxConfig {
        return new InfoBoxConfig(lines, options);
    }

    listBox(
        items: Observable<ListBoxItem[]>,
        options?: {
            noDataMessage?: Observable<string>,
            actions?: ActionButton[],
            title?: Observable<string>,
            titleAlign?: TextAlignEnum,
            wrapInCard?: boolean
        }
    ): ListBoxConfig {
        return new ListBoxConfig(items, options);
    }

    miniBox(
        text: Observable<string>,
        color: BoxColors,
        options?: {
            title: Observable<string>,
            titleAlign: TextAlignEnum,
        }
    ): MiniBoxConfig {
        return new MiniBoxConfig(text, color, options);
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
        lines: Observable<TableBoxLine[]>,
        options?: {
            wrapInCard?: boolean,
            title?: Observable<string>,
            titleAlign?: TextAlignEnum,
        }
    ): TableBoxConfig {
        return new TableBoxConfig(lines, options);
    }

    mapBox(
        apiKey: string,
        address: string,
        lat?: number,
        lng?: number,
        options?: {
            zoom?: number,
            noDataMessage?: Observable<string>,
            actions?: ActionButton[],
            title?: Observable<string>,
            titleAlign?: TextAlignEnum,
            wrapInCard?: boolean
        }
    ): MapBoxConfig {
        return new MapBoxConfig(apiKey, address, lat, lng, options);
    }

}
