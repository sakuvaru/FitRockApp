import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Diet } from 'app/models';

import { ComponentDependencyService } from '../../../../core';
import { BaseClientsPageComponent } from '../../base-clients-page.component';
import { ClientEditDietMenuItems } from '../../menu.items';

@Component({
  templateUrl: 'edit-client-diet-plan-page.component.html'
})
export class EditClientDietPlanPageComponent extends BaseClientsPageComponent implements OnInit {

  public dietId?: number;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected componentDependencyService: ComponentDependencyService,
  ) {
    super(componentDependencyService, activatedRoute);
  }

  ngOnInit() {
    super.ngOnInit();

    super.subscribeToObservable(
      this.clientChange.switchMap(client =>
        this.activatedRoute.params.map(params => {
          this.dietId = +params['dietId'];
        })));
  }

  onDietLoad(diet: Diet): void {
    const translationData: any = {};
    translationData.dietName = diet.dietName;

    this.setConfig({
      componentTitle: { key: 'module.clients.diet.editPlanWithName', data: translationData },
      menuItems: new ClientEditDietMenuItems(this.client.id, diet.id).menuItems,
      menuTitle: {
        key: 'module.clients.viewClientSubtitle',
        data: { 'fullName': this.client.getFullName() }
      },
      menuAvatarUrl: this.client.getAvatarOrGravatarUrl()
    });
  }
}
