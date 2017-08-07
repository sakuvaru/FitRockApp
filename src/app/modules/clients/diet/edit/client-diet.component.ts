// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../../core';

// required by component
import { ClientMenuItems } from '../../menu.items';
import { FormConfig } from '../../../../../web-components/dynamic-form';
import { User, Diet, DietFood } from '../../../../models';
import { DragulaService } from 'ng2-dragula';
import 'rxjs/add/operator/switchMap';
import { Observable, Subscription } from 'rxjs/Rx';
import * as _ from 'underscore';
import { StringHelper } from '../../../../../lib/utilities';
import { DataSource } from '@angular/cdk';

@Component({
    templateUrl: 'client-diet.component.html'
})
export class ClientDietComponent extends BaseComponent implements OnInit, OnDestroy {

    private clientId: number;
    private workoutExists: boolean = true;
    private dietTemplates: Diet[] = [];
    private existingDiets: Diet[];
    private observables: Observable<any>[] = [];
    private observablesCompleted: number = 0;

    private readonly dragulaBag: string = 'dragula-bag';

    /**
     * Drop subscription for dragula - Unsubscribe on destroy!
     */
    private dropSubscription: Subscription;

    constructor(
        private activatedRoute: ActivatedRoute,
        private dragulaService: DragulaService,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService)
    }

    ngOnInit(): void {
        super.ngOnInit();
        super.startLoader();

        // set handle for dragula
        this.dragulaService.setOptions(this.dragulaBag, {
            moves: function (el: any, container: any, handle: any): any {
                return StringHelper.contains(handle.className, 'dragula-move-handle');
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

        var joinedObservable = this.getJoinedObservable();

        joinedObservable
            .takeUntil(this.ngUnsubscribe)
            .subscribe(
            () => {
                this.observablesCompleted++;
                if (this.observablesCompleted === this.observables.length) {
                    super.stopLoader();
                    this.observablesCompleted = 0;
                }
            }
            ,
            error => super.handleError(error));

    }

    ngOnDestroy() {
        super.ngOnDestroy();

        // unsubscribe from dragula drop events
        this.dropSubscription.unsubscribe();
        this.dragulaService.destroy(this.dragulaBag);
    }

    private getJoinedObservable(): Observable<any> {
        var obsClientId = this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .map(params => this.clientId = +params['id']);

        var obsClient = this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .switchMap((params: Params) => this.dependencies.itemServices.userService.editForm(+params['id']))
            .map(form => {
                var client = form.getItem();

                this.setConfig({
                    menuItems: new ClientMenuItems(client.id).menuItems,
                    menuTitle: {
                        key: 'module.clients.viewClientSubtitle',
                        data: { 'fullName': client.getFullName() }
                    },
                    componentTitle: {
                        'key': 'module.clients.submenu.diet'
                    }
                });
            });

        var obsExistingDiets = this.existingDietsObservable();

        var obsDietTemplates = this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .switchMap((params: Params) => this.dependencies.itemServices.dietService.items()
                .byCurrentUser()
                .whereNullOrEmpty('ClientId')
                .orderByAsc("DietName")
                .get())
            .map(response => {
                if (!response.isEmpty()) {
                    this.dietTemplates = response.items;
                }
            });

        this.observables.push(obsClientId);
        this.observables.push(obsClient);
        var obsExistingDiets = this.existingDietsObservable();
        this.observables.push(obsExistingDiets);
        this.observables.push(obsDietTemplates);

        return this.dependencies.coreServices.repositoryClient.mergeObservables(this.observables);
    }

    private existingDietsObservable(): Observable<any> {
        return this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .switchMap((params: Params) => this.dependencies.itemServices.dietService.items()
                .byCurrentUser()
                .includeMultiple(['DietFoods', 'DietFoods.Food', 'DietFoods.Food.FoodUnit'])
                .whereEquals('ClientId', +params['id'])
                .orderByAsc("Order")
                .get())
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

        super.startLoader();

        // copy data from selected diet to a new diet with assigned client
        this.dependencies.itemServices.dietService.copyFromDiet(selectedDiet.id, this.clientId)
            .set()
            .subscribe(response => {
                var obsExistingDiets = this.existingDietsObservable();
                obsExistingDiets.subscribe((response) => {
                    super.stopLoader();
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

    private goToEditDiet(diet: Diet): void{
        super.navigate([this.getTrainerUrl('clients/edit/' + this.clientId + '/diet/' + diet.id + '/diet-plan')]);
    }
}

