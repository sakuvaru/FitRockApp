import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { IComponentConfig } from '../component/component.config';
import { Log } from '../../models/';

/// Shared data app
/// Communication via shared service: https://angular.io/docs/ts/latest/cookbook/component-communication.html#!#bidirectional-service
@Injectable()
export class SharedService {

  // Observable string sources
  private componentConfigSource = new Subject<IComponentConfig>();
  private topLoaderSource = new Subject<boolean>();
  private componentLoaderSource = new Subject<boolean>();
  private errorSource = new Subject<Log>();

  // Observable string streams
  componentConfigChanged$ = this.componentConfigSource.asObservable();
  componentloaderChanged$ = this.componentLoaderSource.asObservable();
  topLoaderChanged$ = this.topLoaderSource.asObservable();
  errorChanged$ = this.errorSource.asObservable();

  // Service message commands
  setComponentConfig(config: IComponentConfig): void {
    this.componentConfigSource.next(config);
  }

  setComponentLoader(enabled: boolean): void {
    this.componentLoaderSource.next(enabled);
  }

  setTopLoader(enabled: boolean): void {
    this.topLoaderSource.next(enabled);
  }

  setError(log: Log): void {
    this.errorSource.next(log);
    // stop loaders on error
    this.componentLoaderSource.next(false);
    this.topLoaderSource.next(false);
  }
}