import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { UrlConfig } from 'app/config';
import { Diet, Workout, Appointment } from 'app/models';

@Injectable()
export class NavigateService {

  constructor(
    private router: Router
  ) { }

  navigate(commands: any[], navigationExtras?: NavigationExtras): void {
    this.router.navigate(commands, navigationExtras);
  }

  getCurrentUrl(): string {
    return this.router.url;
  }

  loginPage(options?: {
    externalLoginError?: boolean
  }): void {
    if (options && options.externalLoginError) {
      this.navigate([UrlConfig.getLoginUrl()], {
        queryParams: {
          loginResult: 'externalFail'
        }
      });
      return;
    }
    this.navigate([UrlConfig.getLoginUrl()]);
  }

  errorPage(navigationExtras?: NavigationExtras): void {
    this.router.navigate([UrlConfig.getErrorUrl()], navigationExtras);
  }

  entryPage(navigationExtras?: NavigationExtras): void {
    this.router.navigate([UrlConfig.getEntryUrl()], navigationExtras);
  }

  unauthorizedPage(navigationExtras?: NavigationExtras): void {
    this.router.navigate([UrlConfig.getUnauthorizedUrl()], navigationExtras);
  }

  notFound404(navigationExtras?: NavigationExtras): void {
    this.router.navigate([UrlConfig.getItem404Url()], navigationExtras);
  }

  serverDownPage(navigationExtras?: NavigationExtras): void {
    this.router.navigate([UrlConfig.getServerDownUrl()], navigationExtras);
  }

  logoutPage(navigationExtras?: NavigationExtras): void {
    this.router.navigate([UrlConfig.getLogoutUrl()], navigationExtras);
  }

  resetPasswordPage(navigationExtras?: NavigationExtras): void {
    this.router.navigate([UrlConfig.getResetPasswordUrl()], navigationExtras);
  }

  item404(navigationExtras?: NavigationExtras): void {
    this.router.navigate([UrlConfig.getItem404Url()], navigationExtras);
  }

  action(action: string, navigationExtras?: NavigationExtras): void {
    this.router.navigate([UrlConfig.getActionUrl(action)], navigationExtras);
  }

  trainerPage(action: string, navigationExtras?: NavigationExtras): void {
    this.router.navigate([UrlConfig.getTrainerUrl(action)], navigationExtras);
  }

  clientPage(action: string, navigationExtras?: NavigationExtras): void {
    this.router.navigate([UrlConfig.getClientUrl(action)], navigationExtras);
  }

  authPage(action: string, navigationExtras?: NavigationExtras): void {
    this.router.navigate([UrlConfig.getAuthUrl(action)], navigationExtras);
  }

  mealPreviewPage(foodId: number, navigationExtras?: NavigationExtras): void {
    this.router.navigate([UrlConfig.getTrainerUrl('/foods/meals/preview/' + foodId)], navigationExtras);
  }

  foodPreviewPage(foodId: number, navigationExtras?: NavigationExtras): void {
    this.router.navigate([UrlConfig.getTrainerUrl('/foods/preview/' + foodId)], navigationExtras);
  }
}
