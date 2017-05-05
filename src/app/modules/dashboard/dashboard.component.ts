import { Component, Input, OnInit } from '@angular/core';
import { Log } from '../../services/log/log.class';
import { WhereEquals, OrderBy, OrderByDescending, Limit, Include, IncludeMultiple } from '../../repository/options.class';
import { LogService } from '../../services/log/log.service';
import { AuthService } from '../../auth/auth.service';
import { CurrentUser } from '../../auth/models/current-user.class';

@Component({
    selector: 'dashboard',
    templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {

    private logs: Log[];
    private log: Log;
    private currentUser: CurrentUser;

    constructor(private logService: LogService, private authService: AuthService) { }

    ngOnInit(): void {
        this.logService.getAll([new Limit(5), new OrderByDescending("id")]).then(logs => this.logs = logs);
        this.logService.getById(1).then(log => this.log = log);
        this.currentUser = this.authService.getCurrentUser();
    }

    onLogout(): void {
        this.authService.logout();
    }
}