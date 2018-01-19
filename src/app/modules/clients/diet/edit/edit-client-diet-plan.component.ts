import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ComponentDependencyService } from '../../../../core';
import { Diet } from '../../../../models';
import { BaseClientModuleComponent } from '../../base-client-module.component';

@Component({
  selector: 'mod-edit-client-diet-plan',
  templateUrl: 'edit-client-diet-plan.component.html'
})
export class EditClientDietPlanComponent extends BaseClientModuleComponent implements OnInit {

  @Input() dietId: number;

  @Output() dietLoad = new EventEmitter<Diet>();

  constructor(
    protected componentDependencyService: ComponentDependencyService,
  ) {
    super(componentDependencyService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  public handleLoadDiet(diet: Diet): void {
    this.dietLoad.next(diet);
  }
}
