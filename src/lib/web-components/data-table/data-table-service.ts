import { DataTableBuilder } from './data-table-builder';

export class DataTableService{

    dataTable<T>(){
        return new DataTableBuilder<T>();
    }
}