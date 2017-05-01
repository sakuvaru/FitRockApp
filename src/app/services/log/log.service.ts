import { Injectable } from '@angular/core';

import { Log } from './log.class';
import { BaseService } from '../base-service.class';
import { IService } from '../iservice.class';
import { RepositoryService } from '../repository/repository.service';

@Injectable()
export class LogService extends BaseService<Log> implements IService<Log>{

    constructor(repositoryService: RepositoryService) { 
        super (repositoryService, "log")
    }
}