import { OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Rx';

import { BasePageComponent, ComponentDependencyService } from '../../core';
import { User } from '../../models';

// Note: importing from barrel caused 'Cannot resolve app parameters' error while building the app
export abstract class BaseClientsPageComponent extends BasePageComponent implements OnInit, OnDestroy {

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
        protected activatedRoute: ActivatedRoute,
    ) {
        super(componentDependencyService, activatedRoute);

        this.initClientSubscriptions();
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
            .map(params => {
                const id = +params['id'];

                // it may happen that id is null if the component does not contain 'id' of client -> e.g. listing of clients
                if (id) {
                    this.clientIdChange.next(id);
                    this.clientId = id;

                    this.initClientSubscription(id);
                }

            })
            .takeUntil(this.ngUnsubscribe)
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
            .switchMap(params => {
                const id = +params['id'];
                return this.dependencies.itemServices.userService.item().byId(id).get();
            })
            .map(response => {
                const user = response.item;
                this.clientChange.next(response.item);
                this.client = user;
            })
            .takeUntil(this.ngUnsubscribe)
            .subscribe();
    }
}

