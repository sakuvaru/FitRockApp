import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { observableHelper } from 'lib/utilities';
import { Observable } from 'rxjs/Rx';

import { BoxColors, InfoBoxConfig, MiniBoxConfig, TableBoxConfig, TableBoxLine, ListBoxConfig, ListBoxItem } from '../../../../web-components/boxes';
import { GraphConfig, PieChart, SingleSeries } from '../../../../web-components/graph';
import { DataTableConfig } from '../../../../web-components/data-table';
import { BaseComponent, ComponentDependencyService, ComponentSetup } from '../../../core';
import { Food } from '../../../models';
import { MealMenuItems } from '../menu.items';

@Component({
    templateUrl: 'preview-meal.component.html'
})
export class PreviewMealComponent extends BaseComponent implements OnInit {

    public food?: Food;
    public foodInfoBox?: InfoBoxConfig;

    public protMiniBox?: MiniBoxConfig;
    public fatMiniBox?: MiniBoxConfig;
    public choMiniBox?: MiniBoxConfig;
    public naclMiniBox?: MiniBoxConfig;
    public sugarMiniBox?: MiniBoxConfig;

    public foodOverviewBox?: TableBoxConfig;

    public mealFoodsBox?: ListBoxConfig;

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

    private initMealFoods(food: Food): void {
        this.mealFoodsBox = this.dependencies.webComponentServices.boxService.listBox(
            Observable.of(food.childFoods.map(m => new ListBoxItem(
                Observable.of(m.food.foodName),
                {
                    secondLine: this.dependencies.coreServices.localizationHelperService.translateFoodAmountAndUnit(
                        m.amount, m.food.foodUnit.unitCode
                    ),
                    extra: this.dependencies.coreServices.localizationHelperService.translateKcalWithKj(m.food.kcal ? m.food.kcal : 0),
                    linkUrl: this.dependencies.coreServices.navigateService.foodPreviewPage(m.food.id).getUrl()
                }))),
            super.translate('module.foods.mealComposition')
        );
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

        const overviewLines = [
            new TableBoxLine(super.translate('module.foods.foodCategory'), super.translate('module.foodCategories.categories.' + food.foodCategory.codename)),
            new TableBoxLine(super.translate('module.foods.measurementUnit'), this.dependencies.coreServices.localizationHelperService.translateFoodAmountAndUnit(food.foodUnitMeasurementValue, food.foodUnit.unitCode)),
            new TableBoxLine(super.translate('module.foods.nutrition.kcal'), this.dependencies.coreServices.localizationHelperService.translateKcalWithKj(food.kcal ? food.kcal : 0))
        ];

        if (food.description) {
            overviewLines.push(new TableBoxLine(super.translate('module.foods.description'), Observable.of(food.description)));
        }

        this.foodOverviewBox = this.dependencies.webComponentServices.boxService.tableBox(
            Observable.of(food.foodName),
            Observable.of(overviewLines)
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
                .includeMultiple(['FoodCategory', 'FoodUnit', 'ChildFoods', 'ChildFoods.Food', 'ChildFoods.Food.FoodUnit'])
                .get()
                .map(response => {
                    this.food = response.item;

                    // init food info boxes
                    this.initFoodBoxes(this.food);
                    this.initMealFoods(this.food);

                    if (this.food.createdByUserId === this.dependencies.authenticatedUserService.getUserId()) {
                        this.setConfig({
                            menuItems: new MealMenuItems(this.food.id).menuItems,
                            menuTitle: {
                                key: this.food.foodName
                            },
                            componentTitle: {
                                'key': 'module.foods.submenu.previewMeal'
                            }
                        });
                    } else {
                        this.setConfig({
                            menuItems: new MealMenuItems(response.item.id).menuItems,
                            menuTitle: {
                                key: response.item.foodName
                            },
                            componentTitle: {
                                'key': 'module.foods.submenu.previewMeal'
                            }
                        });
                    }
                })
            );
    }
}
