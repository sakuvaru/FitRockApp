import { Injectable } from '@angular/core';
import { IComponentConfig } from 'app/core';
import { Subject } from 'rxjs/Subject';

import { Log } from '../../models/';
import { AuthenticatedUser } from '../models/core.models';

/// Shared data app
/// Communication via shared service: https://angular.io/docs/ts/latest/cookbook/component-communication.html#!#bidirectional-service
@Injectable()
export class SharedService {

  public componentConfigCurrent?: IComponentConfig;
  public componentSearchCurrent?: string;

  // Observable string sources
  private componentConfigSource = new Subject<IComponentConfig>();
  private globalLoaderSource = new Subject<boolean>();
  private componentSearchSource = new Subject<string>();
  private errorSource = new Subject<Log>();
  private authenticatedUserSource = new Subject<AuthenticatedUser>();

  // Observable string streams
  componentConfigChanged$ = this.componentConfigSource.asObservable();
  componentSearchChanged$ = this.componentSearchSource.asObservable();
  globalLoaderChanged$ = this.globalLoaderSource.asObservable();
  errorChanged$ = this.errorSource.asObservable();
  authenticatedUserChanged$ = this.authenticatedUserSource.asObservable();

  // Service message commands
  setComponentConfig(config: IComponentConfig): void {
    this.componentConfigCurrent = config;
    this.componentConfigSource.next(config);
  }

  setComponentSearch(search: string): void {
    this.componentSearchCurrent = search;
    this.componentSearchSource.next(search);
  }

  setGlobalLoader(enabled: boolean): void {
    this.globalLoaderSource.next(enabled);
  }

  setError(log: Log): void {
    this.errorSource.next(log);
  }

  setAuthenticatedUser(user: AuthenticatedUser): void {
    this.authenticatedUserSource.next(user);
  }
}
