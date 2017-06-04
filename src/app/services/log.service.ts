import { Injectable } from '@angular/core';
import { Log } from '../models/log.class';
import { RepositoryService } from '../../lib/repository';
import { BaseTypeService } from '../core';

@Injectable()
export class LogService extends BaseTypeService<Log>{

    constructor(repositoryService: RepositoryService) { 
        super (repositoryService, "log")
    }

    createEmptyItem(): Log{
        return new Log();
    }
}