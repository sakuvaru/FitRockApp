import { DataTableBuilder } from './data-table-builder';
import { IItem } from '../../lib/repository';

export class DataTableService {

    dataTable<TItem extends IItem>() {
        return new DataTableBuilder<TItem>();
    }
}
