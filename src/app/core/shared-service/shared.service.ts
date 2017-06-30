import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { IComponentConfig } from '../component/component.config';

/// Shared data app
/// Communication via shared service: https://angular.io/docs/ts/latest/cookbook/component-communication.html#!#bidirectional-service
@Injectable()
export class SharedService {

  // Observable string sources
  private componentConfigSource = new Subject<IComponentConfig>();
  private loaderSource = new Subject<boolean>();

  // Observable string streams
  componentConfigChanged$ = this.componentConfigSource.asObservable();
  loaderChanged$ = this.loaderSource.asObservable();

  // Service message commands
  setComponentConfig(config: IComponentConfig): void {
    this.componentConfigSource.next(config);
  }

  // Service message commands
  setLoader(loaderEnabled: boolean): void {
    this.loaderSource.next(loaderEnabled);
  }
}