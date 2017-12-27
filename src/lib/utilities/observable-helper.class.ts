import { Observable } from 'rxjs/Rx';

export class ObservableHelper {

    /**
     * Returns true if given parameter is an Observable, false otherwise
     * @param value Value to check
     */
    isObservable(value: any): boolean {
        if (value instanceof Observable) {
            return true;
        }
        return false;
    }

    /**
    * https://www.learnrxjs.io/operators/combination/zip.html
    * @param observables Observables to zip
    */
    zipObservables(observables: Observable<any>[]): Observable<any> {
        if (!observables) {
            throw Error(`Given observables are not valid`);
        }

        if (!Array.isArray(observables)) {
            throw Error(`Given observables are not in array`);
        }

        if (observables.length === 0) {
            throw Error(`Observables array doesn't contain any observable`);
        }

        if (observables.length === 1) {
            return observables[0];
        }

        let zippedObservable: Observable<any> = observables[0];

        for (let i = 1; i < observables.length; i++) {
            const currentObservable = observables[i];
            zippedObservable = zippedObservable.zip(currentObservable);
        }

        return zippedObservable;
    }

    /**
    * https://www.learnrxjs.io/operators/combination/forkjoin.html
    * @param observables Observables to fork join
    */
    forkJoinObservables(observables: Observable<any>[]): Observable<any> {
        if (!observables) {
            throw Error(`Given observables are not valid`);
        }

        if (!Array.isArray(observables)) {
            throw Error(`Given observables are not in array`);
        }

        if (observables.length === 0) {
            throw Error(`Observables array doesn't contain any observable`);
        }

        return Observable.forkJoin(observables);
    }
}

export let observableHelper = new ObservableHelper();
