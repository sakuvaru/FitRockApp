import { Injectable } from '@angular/core';
import { Log } from '../models/log.class';
import { BaseTypeService } from '../core/type-service/base-type.service';
import { RepositoryService } from '../repository/repository.service';

@Injectable()
export class LogService extends BaseTypeService<Log>{

    constructor(repositoryService: RepositoryService) { 
        super (repositoryService, "log")
    }

    createEmptyItem(): Log{
        return new Log();
    }
}