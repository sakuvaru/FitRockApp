import { Component, Input, OnInit } from '@angular/core';

import { Log } from '../../services/log/log.class';
import { WhereEquals, OrderBy, OrderByDescending, Limit, Include, IncludeMultiple } from '../../services/repository/options.class';
import { LogService } from '../../services/log/log.service';

@Component({
    selector: 'dashboard',
    templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit{

    private logs: Log[];
    private log: Log;

    constructor(private logService: LogService) { }

    ngOnInit(): void {
        this.logService.getAll( [ new Limit(5), new OrderByDescending("id")]).then(logs => this.logs = logs);
        this.logService.getById(1).then(log => this.log = log);
    }
}