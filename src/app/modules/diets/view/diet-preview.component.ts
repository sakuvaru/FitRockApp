import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { BaseModuleComponent, ComponentDependencyService } from '../../../core';
import { Diet, DietFood } from '../../../models';
import { NumberBoxConfig, BoxColors, TableBoxLine, TableBoxConfig } from 'web-components/boxes';
import { Food } from 'app/models/foods/food.class';
import { GraphConfig, PieChart, SingleSeries } from 'web-components/graph';
import { observableHelper } from 'lib/utilities';

@Component({
  selector: 'mod-diet-preview',
  templateUrl: 'diet-preview.component.html'
})
export class DietPreviewComponent extends BaseModuleComponent implements OnInit, OnChanges {

  @Input() dietId: number;

  @Output() loadDiet = new EventEmitter<Diet>();

  public protMiniBox?: NumberBoxConfig;
  public fatMiniBox?: NumberBoxConfig;
  public choMiniBox?: NumberBoxConfig;
  public naclMiniBox?: NumberBoxConfig;
  public sugarMiniBox?: NumberBoxConfig;

  public dietOverviewBox?: TableBoxConfig;

  public diet: Diet;
  public sortedDietFoods: DietFood[];

  public dietGraph?: GraphConfig<PieChart>;

  constructor(
    protected dependencies: ComponentDependencyService) {
    super(dependencies);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.dietId) {
      super.subscribeToObservable(this.getDietObservable());
      this.initGraph();
    }
  }

  private initGraph(): void {
    this.dietGraph = this.dependencies.webComponentServices.graphService.pieChart(
        this.dependencies.itemServices.dietService.getNutritionDistribution(this.dietId)
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

  private initFoodBoxes(diet: Diet): void {
    const nutrition = this.dependencies.itemServices.dietService.aggregateNutrition(diet, 1);

    this.protMiniBox = this.dependencies.webComponentServices.boxService.numberBox(
        Observable.of(nutrition.prot),
        super.translate('module.foods.nutrition.prot'),
        BoxColors.Primary
    );

    this.fatMiniBox = this.dependencies.webComponentServices.boxService.numberBox(
        Observable.of(nutrition.fat),
        super.translate('module.foods.nutrition.fat'),
        BoxColors.Accent
    );

    this.choMiniBox = this.dependencies.webComponentServices.boxService.numberBox(
        Observable.of(nutrition.cho),
        super.translate('module.foods.nutrition.choShort'),
        BoxColors.Purple
    );

    this.naclMiniBox = this.dependencies.webComponentServices.boxService.numberBox(
        Observable.of(nutrition.nacl),
        super.translate('module.foods.nutrition.nacl'),
        BoxColors.Yellow
    );

    this.sugarMiniBox = this.dependencies.webComponentServices.boxService.numberBox(
        Observable.of(nutrition.sugar),
        super.translate('module.foods.nutrition.sugar'),
        BoxColors.Cyan
    );

    const overviewLines = [
      new TableBoxLine(super.translate('module.diets.dietName'), super.translate(diet.dietName)),
        new TableBoxLine(super.translate('module.diets.dietCategory'), super.translate('module.dietCategories.categories.' + diet.dietCategory.codename)),
        new TableBoxLine(super.translate('module.foods.nutrition.kcal'), this.dependencies.coreServices.localizationHelperService.translateKcalWithKj(nutrition.kcal))
    ];

    if (diet.description) {
        overviewLines.push(new TableBoxLine(super.translate('module.foods.description'), Observable.of(diet.description)));
    }

    this.dietOverviewBox = this.dependencies.webComponentServices.boxService.tableBox(
        super.translate('module.foods.foodInfo'),
        Observable.of(overviewLines)
    );
}

  private getDietObservable(): Observable<void> {
    return this.dependencies.itemServices.dietService.item()
      .byId(this.dietId)
      .includeMultiple(['DietCategory', 'DietFoods.Food.FoodUnit', 'DietFoods', 'DietFoods.Food', 'DietFoods.Food.FoodCategory'])
      .get()
      .map(response => {
        // init boxes
        this.initFoodBoxes(response.item);

        this.loadDiet.next(response.item);

        this.assignDiet(response.item);
      });
  }

  private assignDiet(diet: Diet): void {
    // assign diet after all forms are ready and loaded + order exercises
    diet.dietFoods.sort((n1, n2) => n1.order - n2.order);

    this.sortedDietFoods = this.sortedDietFoods = diet.dietFoods.sort((n1, n2) => n1.order - n2.order);

    this.diet = diet;
  }
}
