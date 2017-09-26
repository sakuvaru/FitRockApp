// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../../core';

// required by component
import { ClientsBaseComponent } from '../../clients-base.component';
import { ClientMenuItems } from '../../menu.items';
import { User, Diet, DietFood } from '../../../../models';
import { DragulaService } from 'ng2-dragula';
import 'rxjs/add/operator/switchMap';
import { Observable, Subscription } from 'rxjs/Rx';
import * as _ from 'underscore';
import { stringHelper } from '../../../../../lib/utilities';

@Component({
    templateUrl: 'client-diet.component.html'
})
export class ClientDietComponent extends ClientsBaseComponent implements OnInit, OnDestroy {

    private workoutExists: boolean = true;
    private dietTemplates: Diet[];
    private existingDiets: Diet[];

    /**
     * Name of the dragula bag - used in the template & config
     */
    private readonly dragulaBag: string = 'dragula-bag';

    /**
     * Class of the handle used to drag & drop dragula items
     */
    private readonly dragulaMoveHandle: string = 'dragula-move-handle';

    /**
     * Drop subscription for dragula - Unsubscribe on destroy!
     */
    private dropSubscription: Subscription;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
        private dragulaService: DragulaService,
    ) {
        super(componentDependencyService, activatedRoute)
    }

    ngOnInit(): void {
        super.ngOnInit();

        this.initDragula();

        super.subscribeToObservables(this.getComponentObservables());
        super.initClientSubscriptions();
    }

    ngOnDestroy() {
        super.ngOnDestroy();

        // unsubscribe from dragula drop events
        this.dropSubscription.unsubscribe();
        this.dragulaService.destroy(this.dragulaBag);
    }

    private initDragula(): void {
        // set handle for dragula
        var that = this;
        this.dragulaService.setOptions(this.dragulaBag, {
            moves: function (el: any, container: any, handle: any): any {
                return stringHelper.contains(handle.className, that.dragulaMoveHandle);
            }
        });

        // subscribe to drop events
        this.dropSubscription = this.dragulaService.drop
            .do(() => super.startGlobalLoader())
            .debounceTime(500)
            .takeUntil(this.ngUnsubscribe)
            .switchMap(() => {
                return this.dependencies.itemServices.dietService.updateItemsOrder(this.existingDiets, this.clientId).set();
            })
            .subscribe(() => {
                super.stopGlobalLoader();
                super.showSavedSnackbar();
            });

    }

    private getComponentObservables(): Observable<any>[] {
        var observables: Observable<any>[] = [];

        var obsClientMenu = this.clientChange
            .takeUntil(this.ngUnsubscribe)
            .map(client => {
                this.setConfig({
                    menuItems: new ClientMenuItems(client.id).menuItems,
                    menuTitle: {
                        key: 'module.clients.viewClientSubtitle',
                        data: { 'fullName': client.getFullName() }
                    },
                    componentTitle: {
                        'key': 'module.clients.submenu.diet'
                    },
                    menuAvatarUrl: client.avatarUrl
                });
            });

        var obsDietTemplates = this.clientIdChange
            .takeUntil(this.ngUnsubscribe)
            .switchMap(clientId => this.dependencies.itemServices.dietService.items()
                .byCurrentUser()
                .whereNullOrEmpty('ClientId')
                .orderByAsc("DietName")
                .get())
            .map(response => {
                if (!response.isEmpty()) {
                    this.dietTemplates = response.items;
                }
            });

        var obsExistingDiets = this.existingDietsObservable();
        var obsExistingDiets = this.existingDietsObservable();

        observables.push(obsClientMenu);
        observables.push(obsDietTemplates);
        observables.push(obsExistingDiets);

        return observables;
    }

    private existingDietsObservable(): Observable<any> {
        return this.clientIdChange
            .takeUntil(this.ngUnsubscribe)
            .switchMap(clientId => this.dependencies.itemServices.dietService.items()
                .byCurrentUser()
                .includeMultiple(['DietFoods', 'DietFoods.Food', 'DietFoods.Food.FoodUnit'])
                .whereEquals('ClientId', clientId)
                .orderByAsc("Order")
                .get())
            .map(response => {
                if (!response.isEmpty()) {
                    this.existingDiets = response.items;
                }
            });
    }

    private reloadExistingDietsObservable(clientId: number): Observable<any> {
        return this.dependencies.itemServices.dietService.items()
            .byCurrentUser()
            .includeMultiple(['DietFoods', 'DietFoods.Food', 'DietFoods.Food.FoodUnit'])
            .whereEquals('ClientId', clientId)
            .orderByAsc("Order")
            .get()
            .map(response => {
                if (!response.isEmpty()) {
                    this.existingDiets = response.items;
                }
            });
    }

    private newDietFromTemplate(data: any): void {
        var selected = data.selected;

        if (!selected) {
            super.translate('module.clients.diet.dietNotSelected').subscribe(text => {
                super.showErrorDialog(text)
            });
        }

        var selectedDiet = selected.value as Diet;

         super.startGlobalLoader();

        // copy data from selected diet to a new diet with assigned client
        this.dependencies.itemServices.dietService.copyFromDiet(selectedDiet.id, this.clientId)
            .set()
            .takeUntil(this.ngUnsubscribe)
            .subscribe(response => {
                var obsExistingDiets = this.reloadExistingDietsObservable(this.clientId);
                obsExistingDiets.subscribe((response) => {
                    super.stopGlobalLoader();
                },
                    error => super.handleError(error)
                )
            },
            error => super.handleError(error)
            );
    }

    private deleteDiet(diet: Diet): void {
        this.startGlobalLoader();
        this.dependencies.itemServices.dietService.delete(diet.id)
            .set()
            .takeUntil(this.ngUnsubscribe)
            .do(() => this.startGlobalLoader())
            .subscribe(response => {
                // remove diet from local variable
                this.existingDiets = _.reject(this.existingDiets, function (item) { return item.id === response.deletedItemId; });

                this.showSavedSnackbar();
                this.stopGlobalLoader();
            },
            (error) => {
                super.handleError(error);
                this.stopGlobalLoader();
            });
    }

    private goToEditDiet(diet: Diet): void {
        super.navigate([this.getTrainerUrl('clients/edit/' + this.clientId + '/diet/' + diet.id + '/diet-plan')]);
    }
}

