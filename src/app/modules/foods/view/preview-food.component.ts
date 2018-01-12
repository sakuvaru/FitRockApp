import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { stringHelper, observableHelper } from 'lib/utilities';
import { Observable } from 'rxjs/Rx';

import { GraphConfig, PieChart, SingleSeries } from '../../../../web-components/graph';
import { BaseComponent, ComponentDependencyService, ComponentSetup } from '../../../core';
import { Food } from '../../../models';
import { FoodMenuItems } from '../menu.items';

@Component({
    templateUrl: 'preview-food.component.html'
})
export class PreviewFoodComponent extends BaseComponent implements OnInit {

    public food?: Food;

    public foodGraph?: GraphConfig<PieChart>;

    constructor(
        private activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService);
    }

    setup(): ComponentSetup {
        return new ComponentSetup({
            initialized: true,
            isNested: false
        });
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.init();
    }

    private init(): void {
        const observables: Observable<any>[] = [];
        observables.push(this.getItemObservable());
        observables.push(this.getGraphConfig());

        super.subscribeToObservables(observables);
    }

    private getGraphConfig(): Observable<void> {
        return this.activatedRoute.params
            .map(params => {
                this.foodGraph = this.dependencies.webComponentServices.graphService.pieChart(
                    this.dependencies.itemServices.foodService.getNutritionDistribution(+params['id'])
                        .set()
                        .map(response => {
                            return new PieChart(response.data.items, {
                                showLabels: true
                            });
                        })
                )
                    .showLegend(true)
                    .dataResolver(data => {
                        data = data as SingleSeries[];

                        const foodTranslations: any = {};
                        const observables: Observable<any>[] = [];

                        // translate all names in series
                        data.forEach(series => {
                            observables.push(
                                super.translate('module.foods.nutrition.' + series.name.toLowerCase())
                                .map(translation => series.name = translation)
                            );
                        });

                        return observableHelper.zipObservables(observables).map(() => data);
                    })
                    .build();
            });

    }

    private getItemObservable(): Observable<void> {
        return this.activatedRoute.params
            .switchMap((params: Params) => this.dependencies.itemServices.foodService.item()
                .byId(+params['id'])
                .get()
                .map(response => {
                    this.food = response.item;

                    if (this.food.createdByUserId === this.dependencies.authenticatedUserService.getUserId()) {
                        this.setConfig({
                            menuItems: new FoodMenuItems(this.food.id).menuItems,
                            menuTitle: {
                                key: this.food.foodName
                            },
                            componentTitle: {
                                'key': 'module.foods.submenu.previewFood'
                            }
                        });
                    } else {
                        this.setConfig({
                            menuItems: new FoodMenuItems(response.item.id).menuItems,
                            menuTitle: {
                                key: response.item.foodName
                            },
                            componentTitle: {
                                'key': 'module.foods.submenu.previewFood'
                            }
                        });
                    }
                })
            );
    }
}
