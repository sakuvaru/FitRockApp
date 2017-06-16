import { Injectable } from '@angular/core';
import { Log } from '../models/log.class';
import { RepositoryClient } from '../../lib/repository';
import { BaseTypeService } from '../core';

@Injectable()
export class LogService extends BaseTypeService<Log>{

    constructor(repositoryClient: RepositoryClient) { 
        super (repositoryClient, "log")
    }

    createEmptyItem(): Log{
        return new Log();
    }
}