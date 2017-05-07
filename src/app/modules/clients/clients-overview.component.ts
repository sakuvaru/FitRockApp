// common
import { Component, Input, Output } from '@angular/core';
import { BaseComponent } from '../../core/base/base.component';
import { AppData } from '../../core/app-data.class';
import { ComponentDependencyService } from '../../core/component-dependency.service';

// required by component

@Component({
    templateUrl: 'clients-overview.component.html'
})
export class ClientsOverviewComponent extends BaseComponent{
   constructor(
       protected componentDependencyService: ComponentDependencyService){
      super(componentDependencyService)
   }

   initAppData(): AppData{
       return new AppData("Clients");
   }
}