// common
import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../../core/base/base.component';
import { AppData } from '../../core/app-data.class';
import { ComponentDependencyService } from '../../core/component-dependency.service';

// required by component
import { Log } from '../../services/log/log.class';
import { WhereEquals, OrderBy, OrderByDescending, Limit, Include, IncludeMultiple } from '../../repository/options.class';
import { LogService } from '../../services/log/log.service';
import { CurrentUser } from '../../auth/models/current-user.class';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'dashboard',
    templateUrl: 'dashboard.component.html'
})
export class DashboardComponent extends BaseComponent implements OnInit {

    private logs: Log[];
    private log: Log;
    private currentUser: CurrentUser;

    constructor(
        private logService: LogService,
        private authService: AuthService,
        protected dependencies: ComponentDependencyService) {
        super(dependencies)
    }

    initAppData(): AppData {
        return new AppData("Dashboard");
    }

    ngOnInit(): void {
        this.logService.getAll([new Limit(5), new OrderByDescending("id")]).subscribe(
                logs => this.logs = logs
        );

        this.logService.getById(1).subscribe(
            log => this.log = log
        );

        // create sample log
        var newLog = new Log({
            user: 'Smurf',
            errorMessage: 'This is a test error',
            stacktrace: 'stacktrace here'
        });

        this.logService.create(newLog).subscribe(
            log => console.log(log.errorMessage)
        );

        this.currentUser = this.authService.getCurrentUser();
    }

    onLogout(): void {
        this.authService.logout();
    }
}