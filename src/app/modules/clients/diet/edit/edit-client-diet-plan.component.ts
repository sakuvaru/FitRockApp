import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { ComponentDependencyService, ComponentSetup } from '../../../../core';
import { Diet } from '../../../../models';
import { ClientsBaseComponent } from '../../clients-base.component';
import { ClientEditDietMenuItems } from '../../menu.items';

@Component({
  templateUrl: 'edit-client-diet-plan.component.html'
})
export class EditClientDietPlanComponent extends ClientsBaseComponent implements OnInit {

  public dietId: number;
  public diet: Diet;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected componentDependencyService: ComponentDependencyService,
  ) {
    super(componentDependencyService, activatedRoute);
  }

  setup(): ComponentSetup {
    return new ComponentSetup({
      initialized: false,
      isNested: false
    });
  }

  ngOnInit() {
    super.ngOnInit();

    this.initDietId();
    super.subscribeToObservable(this.getMenuInitObservable());
    super.initClientSubscriptions();
  }

  private initDietId(): void {
    this.activatedRoute.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe(params => {
        this.dietId = +params['dietId'];
      });
  }

  private getMenuInitObservable(): Observable<any> {
    return this.clientChange.map(client => {
      this.setConfig({
        menuItems: new ClientEditDietMenuItems(client.id, this.dietId).menuItems,
        menuTitle: {
          key: 'module.clients.viewClientSubtitle',
          data: { 'fullName': client.getFullName() }
        },
        menuAvatarUrl: client.getAvatarOrGravatarUrl()
      });
    });
  }

  public handleLoadDiet(diet: Diet): void {
    const translationData: any = {};
    translationData.dietName = diet.dietName;
    super.updateComponentTitle({ key: 'module.clients.diet.editPlanWithName', data: translationData });
  }
}
