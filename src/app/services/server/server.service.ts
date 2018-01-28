import { Injectable } from '@angular/core';
import { RepositoryClient, ControllerModel, ResponseGet } from '../../../lib/repository';
import { BaseTypeService } from '../base/base-type.service';
import { Observable } from 'rxjs/Rx';
import { Day } from 'app/models';

@Injectable()
export class ServerService {

  private readonly controller: string = 'Server';

  constructor(
    private repositoryClient: RepositoryClient) {
  }

  isAuthenticatedOnServer(): Observable<boolean> {
    return this.repositoryClient.get(new ControllerModel(this.controller, 'IsAuthenticated'))
      .set()
      .map((response: any) => {
        return response.authenticated;
      });
  }

  getDays(): Observable<Day[]> {
    return this.repositoryClient.get<ResponseGet<Day[]>>(this.controller, 'GetDays')
      .set()
      .map(response => {
        return response.data.map(m => new Day(m.day, m.dayString));
      });
  }
}
