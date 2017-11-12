import { Injectable } from '@angular/core';
import { RepositoryClient, ControllerModel } from '../../../lib/repository';
import { BaseTypeService } from '../base/base-type.service';
import { Observable } from 'rxjs/Rx';

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
}
