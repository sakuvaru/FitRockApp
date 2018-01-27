import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { observableHelper } from 'lib/utilities';
import { Observable } from 'rxjs/Rx';

import { BoxColors, InfoBoxConfig, NumberBoxConfig, TableBoxConfig, TableBoxLine } from '../../../../web-components/boxes';
import { DataTableConfig } from '../../../../web-components/data-table';
import { GraphConfig, PieChart, SingleSeries } from '../../../../web-components/graph';
import { BaseModuleComponent, ComponentDependencyService } from '../../../core';
import { Food } from '../../../models';
import { TextAlignEnum } from 'web-components';

@Component({
    selector: 'mod-preview-supplement',
    templateUrl: 'preview-supplement.component.html'
})
export class PreviewSupplementComponent extends BaseModuleComponent implements OnInit, OnChanges {

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

    public usedInDishesDataForm?: DataTableConfig;

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
        this.initUsedInFoodsDataForm();
        this.initGraph();

        const observables: Observable<any>[] = [];
        observables.push(this.initFoodObservable());

        super.subscribeToObservables(observables);
    }

    private initUsedInFoodsDataForm(): void {
        this.usedInDishesDataForm = this.dependencies.itemServices.foodDishService.buildDataTable(
            (query, search) => query
                .byCurrentUser()
                .whereLike('ParentFood.FoodName', search)
                .whereEquals('FoodId', this.foodId)
                .include('ParentFood')
        )
            .withFields([{
                name: item => super.translate('module.foods.foodName'),
                value: item => item.parentFood.foodName,
                sortKey: 'ParentFood.FoodName',
                hideOnSmallScreen: false
            }])
            .onClick(item => {
                this.dependencies.coreServices.navigateService.mealPreviewPage(item.parentFoodId).navigate();
            })
            .title(super.translate('module.foods.foodIsUsedIn'))
            .build();
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
            .includeMultiple(['FoodCategory', 'FoodUnit'])
            .get()
            .map(response => {
                this.food = response.item;

                // init food info boxes
                this.initFoodBoxes(this.food);

                this.loadFood.next(this.food);
            }
            );
    }
}
