import { Injectable } from '@angular/core';

import { Client } from '../models/client.class';
import { BaseService } from '../core/repository-service/base-service.class';
import { IService } from '../core/repository-service/iservice.class';
import { RepositoryService } from '../repository/repository.service';

@Injectable()
export class ClientService extends BaseService<Client> implements IService<Client>{

    constructor(repositoryService: RepositoryService) { 
        super (repositoryService, "client")
    }
}