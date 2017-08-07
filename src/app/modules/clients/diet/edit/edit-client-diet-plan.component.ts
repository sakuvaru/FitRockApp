// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig } from '../../../../core';

// required by component
import { ClientEditDietMenuItems } from '../../menu.items';
import { Diet } from '../../../../models';

@Component({
  templateUrl: 'edit-client-diet-plan.component.html'
})
export class EditClientDietPlanComponent extends BaseComponent implements OnInit {

  private clientId: number;
  private dietId: number;
  private diet: Diet;

  constructor(
    private activatedRoute: ActivatedRoute,
    protected dependencies: ComponentDependencyService) {
    super(dependencies)
  }

  ngOnInit() {
    super.ngOnInit();

    this.activatedRoute.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe(params => {
        this.clientId = +params['id'];
        this.dietId = +params['dietId'];
      });
  }

  private handleLoadDiet(diet: Diet): void {
    this.setConfig({
      menuItems: new ClientEditDietMenuItems(this.clientId, this.dietId).menuItems,
      menuTitle: {
        key: diet.dietName
      },
      componentTitle: {
        'key': 'module.clients.diet.editPlan'
      }
    });
  }
}