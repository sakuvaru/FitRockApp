import { Component } from '@angular/core';
import { UrlConfig } from 'app/config';
import { BaseComponent, ComponentDependencyService, ComponentSetup } from 'app/core';

@Component({
  template: '',
})
export class ProcessExternalLoginComponent extends BaseComponent {

  setup(): ComponentSetup {
    return new ComponentSetup({
      initialized: true,
      isNested: false
    });
  }

  constructor(
    protected dependencies: ComponentDependencyService,
  ) {
    super(dependencies);
    
    this.dependencies.coreServices.authService.handleExternalAuthentication(callback => {
      console.log(callback);
      if (callback.isSuccessful) {
        this.navigate([UrlConfig.getEntryUrl()]);
      } else {
        this.navigate([UrlConfig.getLoginUrl()], { 
          queryParams: { 
            loginResult: 'externalFail'
          }
        });
      }
    });
  }
}
