import { Observable } from 'rxjs/Rx';
import { DataSource } from '@angular/cdk/collections';

export class DataTableSource extends DataSource<any> {

    constructor(
        private data: any[]
    ) {
        super();
    }

    connect(): Observable<any[]> {
        return Observable.of(this.data);
    }

    disconnect() { }
}
