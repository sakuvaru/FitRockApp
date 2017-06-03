// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, AppData, BaseComponent } from '../../core';

// required by component
import { BaseField, FormConfig } from '../../../lib/web-components.lib';
import { Limit, OrderByDescending } from '../../../lib/repository.lib';
import { Log } from '../../models';
import { LogService } from '../../services';
import { CurrentUser } from '../../../lib/auth.lib';

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
        return new AppData({
            subTitle: "Dashboard"
        });
    }

    ngOnInit(): void {
        this.logService.getAll([new Limit(5), new OrderByDescending("id")]).subscribe(
            response => {
                console.log(response);
                this.logs = response.items;
            }
        );

        this.logService.getById(2).subscribe(
            response => {
                console.log(response);
                this.log = response.item;
            }
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