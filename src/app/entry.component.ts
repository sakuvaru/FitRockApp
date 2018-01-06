import { Component } from '@angular/core';

import { BaseComponent, ComponentDependencyService, ComponentSetup } from './core';
import { AuthenticatedUser } from './core/models/core.models';

@Component({
  template: '',
})
export class EntryComponent extends BaseComponent {

  setup(): ComponentSetup {
    return new ComponentSetup({
      initialized: true,
      isNested: false,
      disableRepositoryErrors: true
    });
  }

  constructor(
    protected dependencies: ComponentDependencyService,
  ) {
    super(dependencies);
    // try getting current user out of the auth service
    const currentUser = this.dependencies.coreServices.authService.getAuth0UserFromLocalStorage();

    console.log(currentUser);

    // if user is not authenticated, just redirect him to logon page
    if (!currentUser) {
      this.dependencies.coreServices.navigateService.loginPage();
      return;
    }
    
    // save user's gravatar and then user 
    this.dependencies.itemServices.userService
      .saveUserLoginData(currentUser.picture, currentUser.firstName, currentUser.lastName, currentUser.isFemale)
      .do(() => super.startGlobalLoader())
      .flatMap(userGravatarResponse => {
        return this.dependencies.itemServices.userService
          .getAuthUser()
          .map(response => {
            if (response == null) {
              // invalid response
              throw Error('Invalid user response from server, please report this error');
            } else if (!response.item) {
              // redirect him to logon screen
              this.dependencies.coreServices.navigateService.loginPage();
            } else {
              // user is authenticated, update auth user
              const user = response.item;
              const authUser = new AuthenticatedUser(
                user.id,
                user.email,
                user.firstName,
                user.lastName,
                user.trainerUserId,
                user.isClient,
                user.avatarUrl,
                user.getLanguageEnum(),
                currentUser.picture, // this is the gravatar url
                user.licenseString
              );

              // store user in authenticated user service
              this.dependencies.authenticatedUserService.setUser(authUser);

              // store user language ui preference
              this.dependencies.coreServices.currentLanguageService.setLanguage(authUser.language);

              // redirect user
              this.redirectUser(user.isClient);
            }
          })
          .takeUntil(this.ngUnsubscribe);
      }).subscribe(() => undefined,
      (error) => {
        super.handleAppError(error);
      });
  }

  private redirectUser(isClient: boolean): void {
    console.warn('clients are redirected to same page as trainers for now');
    this.dependencies.coreServices.navigateService.trainerPage('');
    return;
    /*
    if (!isClient) {
      this.navigate([UrlConfig.TrainerMasterPath]);
    } else {
      this.navigate([UrlConfig.ClientMasterPath]);
    }
    */
  }
}
