import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ComponentConfig } from '../component/component.config';
import { Log } from '../../models/';

/// Shared data app
/// Communication via shared service: https://angular.io/docs/ts/latest/cookbook/component-communication.html#!#bidirectional-service
@Injectable()
export class SharedService {

  // Observable string sources
  private componentConfigSource = new Subject<ComponentConfig>();
  private topLoaderSource = new Subject<boolean>();
  private componentSearchSource = new Subject<string>();
  private errorSource = new Subject<Log>();
  private componentIsInitializedSource = new Subject<boolean>();

  // Observable string streams
  componentConfigChanged$ = this.componentConfigSource.asObservable();
  componentSearchChanged$ = this.componentSearchSource.asObservable();
  topLoaderChanged$ = this.topLoaderSource.asObservable();
  errorChanged$ = this.errorSource.asObservable();
  componentIsInitializedChanged$ = this.componentIsInitializedSource.asObservable();

  // Service message commands
  setComponentConfig(config: ComponentConfig): void {
    this.componentConfigSource.next(config);
  }

  setComponentSearch(search: string): void{
    this.componentSearchSource.next(search);
  }

  setTopLoader(enabled: boolean): void {
    this.topLoaderSource.next(enabled);
  }

  setError(log: Log): void {
    this.errorSource.next(log);
    // stop loaders on error
    this.topLoaderSource.next(false);
  }

  setComponentIsInitialized(isInitialized: boolean): void{
    this.componentIsInitializedSource.next(isInitialized);
  }
}