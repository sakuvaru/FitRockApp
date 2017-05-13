import { Injectable } from '@angular/core';

import { Log } from '../models/log.class';
import { BaseService } from '../core/repository-service/base-service.class';
import { IService } from '../core/repository-service/iservice.class';
import { RepositoryService } from '../repository/repository.service';

@Injectable()
export class LogService extends BaseService<Log> implements IService<Log>{

    constructor(repositoryService: RepositoryService) { 
        super (repositoryService, "log")
    }
}