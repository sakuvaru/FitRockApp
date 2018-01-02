import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DragulaService } from 'ng2-dragula';
import { Observable, Subscription } from 'rxjs/Rx';
import * as _ from 'underscore';

import { stringHelper } from '../../../../../lib/utilities';
import { AppConfig } from '../../../../config';
import { ComponentDependencyService, ComponentSetup } from '../../../../core';
import { Diet, DietFood } from '../../../../models';
import { ClientsBaseComponent } from '../../clients-base.component';
import { ClientMenuItems } from '../../menu.items';
import { FoodListDialogComponent } from '../dialogs/food-list-dialog.component';

@Component({
    templateUrl: 'client-diet.component.html'
})
export class ClientDietComponent extends ClientsBaseComponent implements OnInit, OnDestroy {

    public workoutExists: boolean = true;
    public dietTemplates: Diet[];
    public existingDiets: Diet[];

    /**
     * Name of the dragula bag - used in the template & config
     */
    public readonly dragulaBag: string = 'dragula-bag';

    /**
     * Class of the handle used to drag & drop dragula items
     */
    public readonly dragulaMoveHandle: string = 'dragula-move-handle';

    /**
     * Drop subscription for dragula - Unsubscribe on destroy!
     */
    private dropSubscription: Subscription;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
        private dragulaService: DragulaService,
    ) {
        super(componentDependencyService, activatedRoute);
    }

    setup(): ComponentSetup {
        return new ComponentSetup({
            initialized: false,
            isNested: false
        });
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
        const that = this;
        this.dragulaService.setOptions(this.dragulaBag, {
            moves: function (el: any, container: any, handle: any): any {
                return stringHelper.contains(el.className, that.dragulaMoveHandle);
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
        const observables: Observable<any>[] = [];

        const obsClientMenu = this.clientChange
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
                    menuAvatarUrl: client.getAvatarOrGravatarUrl()
                });
            });

            const obsDietTemplates = this.clientIdChange
            .takeUntil(this.ngUnsubscribe)
            .switchMap(clientId => this.dependencies.itemServices.dietService.items()
                .byCurrentUser()
                .whereNull('ClientId')
                .orderByAsc('DietName')
                .get())
            .map(response => {
                if (!response.isEmpty()) {
                    this.dietTemplates = response.items;
                }
            });

            const obsExistingDiets = this.existingDietsObservable();

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
                .orderByAsc('Order')
                .get())
            .map(response => {
                if (!response.isEmpty()) {
                    this.existingDiets = response.items;

                    // order diet foods
                    this.existingDiets.forEach(diet => {
                        diet.dietFoods = _.sortBy(diet.dietFoods, m => m.order);
                    });
                }
            });
    }

    private reloadExistingDietsObservable(clientId: number): Observable<any> {
        return this.dependencies.itemServices.dietService.items()
            .byCurrentUser()
            .includeMultiple(['DietFoods', 'DietFoods.Food', 'DietFoods.Food.FoodUnit'])
            .whereEquals('ClientId', clientId)
            .orderByAsc('Order')
            .get()
            .map(response => {
                if (!response.isEmpty()) {
                    this.existingDiets = response.items;
                }
            });
    }

    public newDietFromTemplate(data: any): void {
        const selected = data.selected;

        if (!selected) {
            super.translate('module.clients.diet.dietNotSelected').subscribe(text => {
                super.showErrorDialog(text);
            });
        }

        const selectedDiet = selected.value as Diet;

        // copy data from selected diet to a new diet with assigned client
        super.subscribeToObservable(this.dependencies.itemServices.dietService.copyFromDiet(selectedDiet.id, this.clientId)
            .set()
            .takeUntil(this.ngUnsubscribe)
            .flatMap(response => {
                super.showSavedSnackbar();
                return this.reloadExistingDietsObservable(this.clientId);
            }));
    }

    private deleteDiet(diet: Diet): void {
        this.startGlobalLoader();
        super.subscribeToObservable(this.dependencies.itemServices.dietService.delete(diet.id)
            .set()
            .map(response => {
                // remove diet from local letiable
                this.existingDiets = _.reject(this.existingDiets, function (item) { return item.id === response.deletedItemId; });
                this.showDeletedSnackbar();
            }));
    }

    private goToEditDiet(diet: Diet): void {
        super.navigate([this.getTrainerUrl('clients/edit/' + this.clientId + '/diet/' + diet.id + '/diet-plan')]);
    }
    
    private openFoodListDialog(dietFoods: DietFood[]): void {
        const data: any = {};
        data.dietFoods = dietFoods;

        const dialog = this.dependencies.tdServices.dialogService.open(FoodListDialogComponent, {
            panelClass: AppConfig.DefaultDialogPanelClass,
            data: data
        });
    }
}

