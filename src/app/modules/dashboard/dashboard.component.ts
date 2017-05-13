// common
import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../../core/base/base.component';
import { AppData } from '../../core/app-data.class';
import { ComponentDependencyService } from '../../core/component-dependency.service';

// required by component
import { Log } from '../../models/log.class';
import { WhereEquals, OrderBy, OrderByDescending, Limit, Include, IncludeMultiple } from '../../repository/options.class';
import { LogService } from '../../services/log.service';
import { CurrentUser } from '../../core/auth/models/current-user.class';

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

        this.logService.getById(2).subscribe(
            log => this.log = log,
            error => console.log(error)
        );

        /*
        // create sample log
        var newLog = new Log({
            user: 'Smurf',
            errorMessage: 'This is a test error',
            stacktrace: 'stacktrace here'
        });

        this.logService.create(newLog).subscribe(
            log => console.log(log.errorMessage)
        );
        
        

        // edit log
        var editLog = new Log({
            errorMessage: "This was edited by smurfie",
            user:'Smurfy smurf',
            id: 1
        });

        this.logService.edit(editLog).subscribe(
            log => console.log(log)
        );
        */

        //this.logService.delete(1).subscribe( isSuccess => console.log(isSuccess));

        this.currentUser = this.dependencies.authService.getCurrentUser();
    }

    onLogout(): void {
        this.dependencies.authService.logout();
    }
}