import { Component } from '@angular/core';
import { BasePageComponent, ComponentDependencyService, ComponentSetup } from 'app/core';

@Component({
  template: '',
})
export class ProcessExternalLoginComponent extends BasePageComponent {

  constructor(
    protected dependencies: ComponentDependencyService,
  ) {
    super(dependencies);
    
    this.dependencies.coreServices.authService.handleExternalAuthentication(callback => {
      if (callback.isSuccessful) {
        this.dependencies.coreServices.navigateService.loginPage().navigate();
      } else {
        this.dependencies.coreServices.navigateService.loginPage({externalLoginError: true}).navigate();
      }
    });
  }
}
