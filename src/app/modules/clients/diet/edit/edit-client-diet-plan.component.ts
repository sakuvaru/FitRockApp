// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig } from '../../../../core';

// required by component
import { ClientsBaseComponent } from '../../clients-base.component';
import { ClientEditDietMenuItems } from '../../menu.items';
import { Diet } from '../../../../models';

@Component({
  templateUrl: 'edit-client-diet-plan.component.html'
})
export class EditClientDietPlanComponent extends ClientsBaseComponent implements OnInit {

  private dietId: number;
  private diet: Diet;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected componentDependencyService: ComponentDependencyService,
  ) {
    super(componentDependencyService, activatedRoute)
  }

  ngOnInit() {
    super.ngOnInit();

    this.initDietId();
    super.initClientSubscriptions();
  }

  private initDietId(): void {
    this.activatedRoute.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe(params => {
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