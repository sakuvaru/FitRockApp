import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { observableHelper } from 'lib/utilities';
import { Observable } from 'rxjs/Rx';

import { InfoBoxConfig, InfoBoxLine, InfoBoxLineType, MiniBoxConfig, BoxColors } from '../../../../web-components/boxes';
import { GraphConfig, PieChart, SingleSeries } from '../../../../web-components/graph';
import { BaseComponent, ComponentDependencyService, ComponentSetup } from '../../../core';
import { Food } from '../../../models';
import { FoodMenuItems } from '../menu.items';

@Component({
    templateUrl: 'preview-food.component.html'
})
export class PreviewFoodComponent extends BaseComponent implements OnInit {

    public food?: Food;
    public foodInfoBox?: InfoBoxConfig;

    public protMiniBox?: MiniBoxConfig;
    public fatMiniBox?: MiniBoxConfig;
    public choMiniBox?: MiniBoxConfig;
    public naclMiniBox?: MiniBoxConfig;
    public sugarMiniBox?: MiniBoxConfig;

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

    private initFoodBoxes(food: Food): void {
        this.protMiniBox = this.dependencies.webComponentServices.boxService.miniBox(
            Observable.of(food.prot ? food.prot.toString() : '0'),
            super.translate('module.foods.nutrition.prot'),
            BoxColors.Primary
        );

        this.fatMiniBox = this.dependencies.webComponentServices.boxService.miniBox(
            Observable.of(food.fat ? food.fat.toString() : '0'),
            super.translate('module.foods.nutrition.fat'),
            BoxColors.Accent
        );

        this.choMiniBox = this.dependencies.webComponentServices.boxService.miniBox(
            Observable.of(food.cho ? food.cho.toString() : '0'),
            super.translate('module.foods.nutrition.choShort'),
            BoxColors.Purple
        );

        this.naclMiniBox = this.dependencies.webComponentServices.boxService.miniBox(
            Observable.of(food.nacl ? food.nacl.toString() : '0'),
            super.translate('module.foods.nutrition.nacl'),
            BoxColors.Yellow
        );

        this.sugarMiniBox = this.dependencies.webComponentServices.boxService.miniBox(
            Observable.of(food.sugar ? food.sugar.toString() : '0'),
            super.translate('module.foods.nutrition.sugar'),
            BoxColors.Cyan
        );
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
                    .showLegend(false)
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

                    // init food info boxes
                    this.initFoodBoxes(this.food);

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
