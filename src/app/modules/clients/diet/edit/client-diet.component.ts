import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { Observable, Subscription } from 'rxjs/Rx';
import * as _ from 'underscore';

import { stringHelper } from '../../../../../lib/utilities';
import { AppConfig } from '../../../../config';
import { ComponentDependencyService } from '../../../../core';
import { Diet, DietFood } from '../../../../models';
import { BaseClientModuleComponent } from '../../base-client-module.component';
import { FoodListDialogComponent } from '../dialogs/food-list-dialog.component';

@Component({
    selector: 'mod-client-diet',
    templateUrl: 'client-diet.component.html'
})
export class ClientDietComponent extends BaseClientModuleComponent implements OnInit, OnDestroy, OnChanges {

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
        protected componentDependencyService: ComponentDependencyService,
        private dragulaService: DragulaService,
    ) {
        super(componentDependencyService);
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.client) {
            this.init();
        }
    }

    ngOnDestroy() {
        super.ngOnDestroy();

        // unsubscribe from dragula drop events
        this.dropSubscription.unsubscribe();
        this.dragulaService.destroy(this.dragulaBag);
    }

    deleteDiet(diet: Diet): void {
        this.startGlobalLoader();
        super.subscribeToObservable(this.dependencies.itemServices.dietService.delete(diet.id)
            .set()
            .map(response => {
                // remove diet from local letiable
                this.existingDiets = _.reject(this.existingDiets, function (item) { return item.id === response.deletedItemId; });
                this.showDeletedSnackbar();
            }));
    }

    goToEditDiet(diet: Diet): void {
        super.navigate([this.getTrainerUrl('clients/edit/' + this.client.id + '/diet/' + diet.id + '/diet-plan')]);
    }

    openFoodListDialog(dietFoods: DietFood[]): void {
        const data: any = {};
        data.dietFoods = dietFoods;

        const dialog = this.dependencies.tdServices.dialogService.open(FoodListDialogComponent, {
            panelClass: AppConfig.DefaultDialogPanelClass,
            data: data
        });
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
                return this.dependencies.itemServices.dietService.updateItemsOrder(this.existingDiets, this.client.id).set();
            })
            .subscribe(() => {
                super.stopGlobalLoader();
                super.showSavedSnackbar();
            });

    }

    private init(): void {
        const observables: Observable<any>[] = [];
           observables.push(this.dependencies.itemServices.dietService.items()
                .byCurrentUser()
                .whereNull('ClientId')
                .orderByAsc('DietName')
                .get()
            .map(response => {
                if (!response.isEmpty()) {
                    this.dietTemplates = response.items;
                }
            }));

            observables.push(this.existingDietsObservable());

        super.subscribeToObservables(observables);

        this.initDragula();
    }

    private existingDietsObservable(): Observable<any> {
        return this.dependencies.itemServices.dietService.items()
                .byCurrentUser()
                .includeMultiple(['DietFoods', 'DietFoods.Food', 'DietFoods.Food.FoodUnit'])
                .whereEquals('ClientId', this.client.id)
                .orderByAsc('Order')
                .get()
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

    private reloadExistingDietsObservable(): Observable<any> {
        return this.dependencies.itemServices.dietService.items()
            .byCurrentUser()
            .includeMultiple(['DietFoods', 'DietFoods.Food', 'DietFoods.Food.FoodUnit'])
            .whereEquals('ClientId', this.client.id)
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
        super.subscribeToObservable(this.dependencies.itemServices.dietService.copyFromDiet(selectedDiet.id, this.client.id)
            .set()
            .takeUntil(this.ngUnsubscribe)
            .flatMap(response => {
                super.showSavedSnackbar();
                return this.reloadExistingDietsObservable();
            }));
    }
}

