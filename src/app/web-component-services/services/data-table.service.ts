import { Injectable } from '@angular/core';
import { IItem, MultipleItemQuery, ResponseMultiple, ItemCountQuery } from '../../../lib/repository';
import { Observable } from 'rxjs/Observable';
import { DataTableBuilder, DataTableResponse } from '../../../web-components/data-table';
import { AppConfig } from '../../config';

export class DataTableService {

    constructor(
    ) { }

    dataTable<TItem extends IItem>(
        data: (search: string) => MultipleItemQuery<TItem>,
    ): DataTableBuilder<TItem> {
        return new DataTableBuilder<TItem>(data);
    }
}




