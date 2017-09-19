// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../core';

// required by component
import { User } from '../../models';
import { ClientMenuItems } from './menu.items';
import { GraphConfig, MultiSeries, BaseGraph, SingleSeries, LineChart, VerticalBarChart } from '../../../web-components/graph';
import { Observable, Subject } from 'rxjs/Rx';

@Component({
})
export abstract class ClientsBaseComponent extends BaseComponent implements OnInit, OnDestroy {

    /**
     * Subject containnig whole User object
     */
    protected clientChange: Subject<User> = new Subject<User>();

    /**
     * Subject with only userId of current client
     */
    protected clientIdChange: Subject<number> = new Subject<number>();

    /**
     * Contains resolved client Id
     */
    protected clientId: number;

    /**
     * Contains resolved client
     */
    protected client: User;

    /**
     * Indicates if the component will subscribe to whole User object
     * This is useful when inheriting component does not need to access subscribe to 'User' object
     * because it loads the User some other way (e.g. forms already contain User object)
     */
    private subscribeToClient: boolean = true;

    constructor(
        protected componentDependencyService: ComponentDependencyService,
        protected activatedRoute: ActivatedRoute,
        protected options?: {
            subscribeToClient?: boolean
        }) {
        super(componentDependencyService)

        if (options) {
            Object.assign(this, options);
        }
    }

    ngOnInit() {
        super.ngOnInit();
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }

    /**
     * Every child component needs to call this method AFTER its subscription are defined, otherwise it could happen
     * that the subject is emitted before the child component had a change to subscribe to it.
     */
    initClientSubscriptions(): void {
        // subscribe to client id changes
        this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .map(params => {
                var id = +params['id'];

                // it may happen that id is null if the component does not contain 'id' of client -> e.g. listing of clients
                if (id) {
                    this.clientIdChange.next(id);
                    this.clientId = id;

                    if (this.subscribeToClient) {
                        this.initClientSubscription(id);
                    }
                }

            })
            .subscribe();
    }

    private initClientSubscription(userId: number): void {
        this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .switchMap(params => {
                var id = +params['id'];
                return this.dependencies.itemServices.userService.item().byId(id).get()
            })
            .map(response => {
                var user = response.item;
                this.clientChange.next(response.item);
                this.client = user;
                super.stopGlobalLoader();
            })
            .subscribe();
    }
}

