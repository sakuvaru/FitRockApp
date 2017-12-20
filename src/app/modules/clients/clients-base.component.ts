// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
// Note: importing from barrel caused 'Cannot resolve app parameters' error while building the app
import { ComponentDependencyService } from '../../core/component/component-dependency.service';
import { BaseComponent } from '../../core/component/base.component';
import { ComponentSetup } from '../../core/component/component-setup.class';

// required by component
import { User } from '../../models';
import { ClientMenuItems } from './menu.items';
import { GraphConfig, MultiSeries, BaseGraph, SingleSeries, LineChart, VerticalBarChart } from '../../../web-components/graph';
import { Observable, Subject } from 'rxjs/Rx';

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
    public clientId: number;

    /**
     * Contains resolved client
     */
    public client: User;

    constructor(
        protected componentDependencyService: ComponentDependencyService,
        protected activatedRoute: ActivatedRoute
    ) {
        super(componentDependencyService);
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
                const id = +params['id'];

                // it may happen that id is null if the component does not contain 'id' of client -> e.g. listing of clients
                if (id) {
                    this.clientIdChange.next(id);
                    this.clientId = id;

                    this.initClientSubscription(id);
                }

            })
            .subscribe();
    }

    /**
     * Gets avatar or gravatar from form item
     * @param formItem Form item
     */
    getAvatarOrGravatarFromFormItem(formItem: any): string | undefined {
        if (!formItem) {
            return undefined;
        }

        const avatarUrl = formItem.avatarUrl;
        const gravatarUrl = formItem.gravatarUrl;

        if (avatarUrl) {
            return avatarUrl;
        }

        if (gravatarUrl) {
            return gravatarUrl;
        }

        return undefined;
    }

    private initClientSubscription(userId: number): void {
        this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .switchMap(params => {
                const id = +params['id'];
                return this.dependencies.itemServices.userService.item().byId(id).get();
            })
            .map(response => {
                const user = response.item;
                this.clientChange.next(response.item);
                this.client = user;
                super.stopGlobalLoader();
            })
            .subscribe();
    }
}

