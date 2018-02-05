import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { Observable, Subscription } from 'rxjs/Rx';
import * as _ from 'underscore';

import { stringHelper } from '../../../../../lib/utilities';
import { ComponentDependencyService } from '../../../../core';
import { Day, Diet } from '../../../../models';
import { BaseClientModuleComponent } from '../../base-client-module.component';

@Component({
    selector: 'mod-client-diet',
    templateUrl: 'client-diet.component.html'
})
export class ClientDietComponent extends BaseClientModuleComponent implements OnInit, OnDestroy, OnChanges {

    public dietTemplates: Diet[] = [];

    /**
     * Name of the dragula bag - used in the template & config
     */
    public readonly dragulaBag: string = 'dragula-bag';
    public readonly dragulaBagParent: string = 'dragula-bag-parent';

    /**
     * Class of the handle used to drag & drop dragula items
     */
    public readonly dragulaMoveHandle: string = 'dragula-move-handle';

    /**
     * Drop subscription for dragula - Unsubscribe on destroy!
     */
    private dropSubscription: Subscription;

    public days: DayWithDiets[] = [];

    constructor(
        protected componentDependencyService: ComponentDependencyService,
        private dragulaService: DragulaService,
    ) {
        super(componentDependencyService);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.makeSureDragulaIsUnsubscribed();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.client) {
            this.init();
        }
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this.makeSureDragulaIsUnsubscribed();
    }

    deleteDiet(diet: Diet): void {
        super.subscribeToObservable(this.dependencies.itemServices.dietService.delete(diet.id)
            .set()
            .map(response => {
                // remove diet from local variable
                this.days.map(day => day.diets = _.reject(day.diets, function (item) { return item.id === response.deletedItemId; }));
                this.showDeletedSnackbar();
            }));
    }

    goToEditDiet(diet: Diet): void {
        if (diet.clientId) {
            this.dependencies.coreServices.navigateService.clientDietPlanPage(diet.clientId, diet.id).navigate();
        }
    }

    goToDietPreview(diet: Diet): void {
        if (diet.clientId) {
            this.dependencies.coreServices.navigateService.clientDietPreviewPage(diet.clientId, diet.id).navigate();
        }
    }

    newDietFromTemplate(data: any): void {
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
                // reload diets
                return this.existingDietsObservable();
            })
            .map(response => {
                super.showSavedSnackbar();

            }));
    }

    private makeSureDragulaIsUnsubscribed(): void {
        // unsubscribe from dragula drop events
        if (this.dropSubscription) {
            this.dropSubscription.unsubscribe();
        }

        if (this.dragulaService.find(this.dragulaBag)) {
            this.dragulaService.destroy(this.dragulaBag);
        }
        if (this.dragulaService.find(this.dragulaBagParent)) {
            this.dragulaService.destroy(this.dragulaBagParent);
        }
    }

    private getUpdateDietDayObservable(): Observable<void> {
        // go through all days and find diet which were updated
        let saveObservable = Observable.of(undefined);
        this.days.map(day => day.diets.map(diet => {
            if (diet.day !== day.day.day) {
                // Day was change, update local variables 
                diet.day = day.day.day;
                diet.dayString = day.day.dayString;

                saveObservable = this.dependencies.itemServices.dietService.edit(diet).set().map(response => undefined);
            }
        }));

        return saveObservable;
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

        // days need to loaded before diets can be initialized
        observables.push(this.getInitDaysObservable().flatMap(() => this.existingDietsObservable()));

        super.subscribeToObservables(observables);

        this.initDragula();
    }

    private getOrderedDietsFromDays(): Diet[] {
        const orderedDiets: Diet[] = [];
        this.days.map(day => day.diets.map(s => orderedDiets.push(s)));

        return orderedDiets;
    }

    private initDragula(): void {
        // set handle for dragula
        const that = this;
        this.dragulaService.setOptions(this.dragulaBag, {
            moves: function (el: any, container: any, handle: any): any {
                return stringHelper.contains(handle.className, that.dragulaMoveHandle);
            }
        });

        this.dragulaService.setOptions(this.dragulaBagParent, {
            moves: function (el: any, container: any, handle: any): any {
                // we don't want parent to move 
                return false;
            }
        });

        // subscribe to drop events
        this.dropSubscription = this.dragulaService.drop
            .do(() => super.startGlobalLoader())
            .debounceTime(500)
            .flatMap(value => {
                const updateOrderObservable = this.dependencies.itemServices.dietService.updateItemsOrder(this.getOrderedDietsFromDays(), this.client.id).set();
                const updateDietObservable = this.getUpdateDietDayObservable();

                return updateOrderObservable.zip(updateDietObservable);
            })

            .takeUntil(this.ngUnsubscribe)
            .subscribe(() => {
                super.stopGlobalLoader();
                super.showSavedSnackbar();
            });
    }

    private existingDietsObservable(): Observable<void> {
        return this.dependencies.itemServices.dietService.items()
            .byCurrentUser()
            .includeMultiple(['DietFoods', 'DietFoods.Food', 'DietFoods.Food.FoodUnit'])
            .whereEquals('ClientId', this.client.id)
            .orderByAsc('Order')
            .get()
            .map(response => {
                if (!response.isEmpty()) {
                    // assign diets to days
                    this.assignDietToDays(response.items);
                }
            });
    }

    private getInitDaysObservable(): Observable<void> {
        return this.dependencies.coreServices.serverService.getDays()
            .map(days => {
                this.days = days.map(day => new DayWithDiets(day, []));
            });
    }

    private assignDietToDays(diets: Diet[]): void {
        if (!diets || diets.length === 0) {
            return;
        }

        // first make sure that days contain no diets
        this.days.map(day => {
            day.diets = [];
        });

        const unassignedDayValue = 0;
        const unassignedDay = this.days.find(m => m.day.day === unassignedDayValue);

        if (!unassignedDay) {
            throw Error(`Could not find unassigned day with value '${unassignedDayValue}'`);
        }

        diets.forEach(diet => {
            const day = this.days.find(m => m.day.day === diet.day);

            if (!day) {
                // unassigned diet
                unassignedDay.diets.push(diet);
            } else {
                day.diets.push(diet);
            }
        });

        // order diets based on their order
        this.days.map(day => {
            day.diets = _.sortBy(day.diets, m => m.order);
        });
    }
}

class DayWithDiets {
    constructor(
        public day: Day,
        public diets: Diet[] = []
    ) { }
}

