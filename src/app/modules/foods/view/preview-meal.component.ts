import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { observableHelper } from 'lib/utilities';
import { Observable } from 'rxjs/Rx';

import {
    BoxColors,
    InfoBoxConfig,
    ListBoxConfig,
    ListBoxItem,
    NumberBoxConfig,
    TableBoxConfig,
    TableBoxLine,
} from '../../../../web-components/boxes';
import { GraphConfig, PieChart, SingleSeries } from '../../../../web-components/graph';
import { BaseModuleComponent, ComponentDependencyService } from '../../../core';
import { Food } from '../../../models';
import { TextAlignEnum } from 'web-components';

@Component({
    selector: 'mod-preview-meal',
    templateUrl: 'preview-meal.component.html'
})
export class PreviewMealComponent extends BaseModuleComponent implements OnInit, OnChanges {

    @Input() foodId: number;

    @Output() loadFood = new EventEmitter<Food>();

    public food?: Food;
    public foodInfoBox?: InfoBoxConfig;

    public protMiniBox?: NumberBoxConfig;
    public fatMiniBox?: NumberBoxConfig;
    public choMiniBox?: NumberBoxConfig;
    public naclMiniBox?: NumberBoxConfig;
    public sugarMiniBox?: NumberBoxConfig;

    public foodOverviewBox?: TableBoxConfig;

    public mealFoodsBox?: ListBoxConfig;

    public foodGraph?: GraphConfig<PieChart>;

    constructor(
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService);
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.foodId) {
            this.init();
        }
    }

    private init(): void {
        this.initGraph();

        const observables: Observable<any>[] = [];
        observables.push(this.initFoodObservable());

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
                    extra: this.dependencies.coreServices.localizationHelperService.translateKcalWithKj(this.dependencies.itemServices.foodService.calculateFoodWithAmount(m.food, m.amount).kcal),
                    linkUrl: this.dependencies.coreServices.navigateService.foodPreviewPage(m.food.id).getUrl()
                }))),
            super.translate('module.foods.mealComposition'),
            TextAlignEnum.Left,
        );
    }

    private initFoodBoxes(food: Food): void {
        this.protMiniBox = this.dependencies.webComponentServices.boxService.numberBox(
            Observable.of(food.prot ? food.prot : 0),
            super.translate('module.foods.nutrition.prot'),
            BoxColors.Primary
        );

        this.fatMiniBox = this.dependencies.webComponentServices.boxService.numberBox(
            Observable.of(food.fat ? food.fat : 0),
            super.translate('module.foods.nutrition.fat'),
            BoxColors.Accent
        );

        this.choMiniBox = this.dependencies.webComponentServices.boxService.numberBox(
            Observable.of(food.cho ? food.cho : 0),
            super.translate('module.foods.nutrition.choShort'),
            BoxColors.Purple
        );

        this.naclMiniBox = this.dependencies.webComponentServices.boxService.numberBox(
            Observable.of(food.nacl ? food.nacl : 0),
            super.translate('module.foods.nutrition.nacl'),
            BoxColors.Yellow
        );

        this.sugarMiniBox = this.dependencies.webComponentServices.boxService.numberBox(
            Observable.of(food.sugar ? food.sugar : 0),
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
            super.translate('module.foods.foodInfo'),
            TextAlignEnum.Left,
            Observable.of(overviewLines)
        );
    }

    private initGraph(): void {
        this.foodGraph = this.dependencies.webComponentServices.graphService.pieChart(
            this.dependencies.itemServices.foodService.getNutritionDistribution(this.foodId)
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
    }

    private initFoodObservable(): Observable<void> {
        return this.dependencies.itemServices.foodService.item()
            .byId(this.foodId)
            .includeMultiple(['FoodCategory', 'FoodUnit', 'ChildFoods', 'ChildFoods.Food', 'ChildFoods.Food.FoodUnit'])
            .get()
            .map(response => {
                this.food = response.item;

                // init food info boxes
                this.initFoodBoxes(this.food);
                this.initMealFoods(this.food);

                this.loadFood.next(this.food);
            });
    }
}
