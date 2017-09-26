import { Observable } from 'rxjs/Rx';

export class ObservableHelper {

    /**
    * Zips array of observables into one that gets executed once all inner subscriptions complete
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

        var zippedObservable: Observable<any> = observables[0];

        for (var i = 1; i < observables.length; i++) {
            var currentObservable = observables[i];
            zippedObservable = zippedObservable.zip(currentObservable);
        }

        return zippedObservable;
    }
}

export var observableHelper = new ObservableHelper();