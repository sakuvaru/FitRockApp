import { Injectable } from '@angular/core';
import { IItem, MultipleItemQuery, ResponseMultiple } from '../../../lib/repository';
import { Observable } from 'rxjs/Observable';
import { DataTableBuilder, DataTableResponse } from '../../../web-components/data-table';
import { AppConfig } from '../../config';

export class DataTableService {

    constructor(
    ) { }

    dataTable<TItem extends IItem>(
        data: (pageSize: number, page: number, search: string, limit: number) => Observable<DataTableResponse>,
    ): DataTableBuilder<TItem> {

        const builder = new DataTableBuilder<TItem>(data);

        return builder;
    }

}




