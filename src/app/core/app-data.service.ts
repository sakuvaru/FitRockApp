import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { AppData } from './app-data.class';

/// Shared data app
/// Communication via shared service: https://angular.io/docs/ts/latest/cookbook/component-communication.html#!#bidirectional-service
@Injectable()
export class AppDataService {

  // Observable string sources
  private appDataSource = new Subject<AppData>();

  // Observable string streams
  appDataChanged$ = this.appDataSource.asObservable();

  // Service message commands
  setAppData(appData: AppData): void {
    this.appDataSource.next(appData);
  }
}