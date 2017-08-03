// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../core';

// required by component
import { Log } from '../../models';
import { CurrentUser } from '../../../lib/auth';

@Component({
    selector: 'dashboard',
    templateUrl: 'dashboard.component.html'
})
export class DashboardComponent extends BaseComponent implements OnInit {

    private logs: Log[];
    private log: Log;
    private currentUser: CurrentUser | null;

    constructor(
        protected dependencies: ComponentDependencyService) {
        super(dependencies)
    }

    ngOnInit(): void {
        super.ngOnInit();

        this.setConfig({
            menuTitle: { key: 'menu.main'},
            componentTitle: { key: 'menu.dashboard'}
        });

        this.dependencies.itemServices.logService.items().limit(5).orderByDesc('id').get()
            .takeUntil(this.ngUnsubscribe)
            .subscribe(
            response => {
                console.log(response);
                this.logs = response.items;
            });


        /* this.dependencies.itemServices.logService.item().byId(2).get().subscribe(
             response => {
                 console.log(response);
                 this.log = response.item;
             }
         );
         */
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

        this.currentUser = this.dependencies.coreServices.authService.getCurrentUser();
    }

    onLogout(): void {
        this.dependencies.coreServices.authService.logout();
    }
}