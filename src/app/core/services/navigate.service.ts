import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { UrlConfig } from 'app/config';
import { Diet, Workout, Appointment } from 'app/models';
import { NavigateResult } from '../models/core.models';

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
  }): NavigateResult {
    if (options && options.externalLoginError) {
      this.getNavigateResult(UrlConfig.getLoginUrl(), {
        queryParams: {
          loginResult: 'externalFail'
        }
      });
    }
    return this.getNavigateResult(UrlConfig.getLoginUrl());
  }

  sessionLockPage(navigationExtras?: NavigationExtras): NavigateResult {
    return this.getNavigateResult(UrlConfig.getSessionLockUrl());
  }

  errorPage(navigationExtras?: NavigationExtras): NavigateResult {
    return this.getNavigateResult(UrlConfig.getErrorUrl());
  }

  entryPage(navigationExtras?: NavigationExtras): NavigateResult {
    return this.getNavigateResult(UrlConfig.getEntryUrl());
  }

  unauthorizedPage(navigationExtras?: NavigationExtras): NavigateResult {
    return this.getNavigateResult(UrlConfig.getUnauthorizedUrl());
  }

  notFound404(navigationExtras?: NavigationExtras): NavigateResult {
    return this.getNavigateResult(UrlConfig.getItem404Url());
  }

  serverDownPage(navigationExtras?: NavigationExtras): NavigateResult {
    return this.getNavigateResult(UrlConfig.getServerDownUrl());
  }

  logoutPage(navigationExtras?: NavigationExtras): NavigateResult {
    return this.getNavigateResult(UrlConfig.getLogoutUrl());
  }

  resetPasswordPage(navigationExtras?: NavigationExtras): NavigateResult {
    return this.getNavigateResult(UrlConfig.getResetPasswordUrl());
  }

  item404(navigationExtras?: NavigationExtras): NavigateResult {
    return this.getNavigateResult(UrlConfig.getItem404Url());
  }

  action(action: string, navigationExtras?: NavigationExtras): NavigateResult {
    return this.getNavigateResult(UrlConfig.getActionUrl(action));
  }

  trainerDashboardPage(navigationExtras?: NavigationExtras): NavigateResult {
    return this.getNavigateResult(UrlConfig.getTrainerDashboardUrl());
  }

  clientDashboardPage(navigationExtras?: NavigationExtras): NavigateResult {
    return this.getNavigateResult(UrlConfig.getClientDashboardUrl());
  }

  trainerPage(action: string, navigationExtras?: NavigationExtras): NavigateResult {
    return this.getNavigateResult(UrlConfig.getTrainerUrl(action));
  }

  clientPage(action: string, navigationExtras?: NavigationExtras): NavigateResult {
    return this.getNavigateResult(UrlConfig.getClientUrl(action));
  }

  authPage(action: string, navigationExtras?: NavigationExtras): NavigateResult {
    return this.getNavigateResult(UrlConfig.getAuthUrl(action));
  }

  mealPreviewPage(foodId: number, navigationExtras?: NavigationExtras): NavigateResult {
    return this.getNavigateResult(UrlConfig.getTrainerUrl('/foods/meals/preview/' + foodId));
  }

  foodPreviewPage(foodId: number, navigationExtras?: NavigationExtras): NavigateResult {
    return this.getNavigateResult(UrlConfig.getTrainerUrl('/foods/preview/' + foodId));
  }

  private getNavigateResult(url, navigationExtras?: NavigationExtras): NavigateResult {
    return new NavigateResult((xUrl) => this.router.navigate([xUrl], navigationExtras), url);
  }
}
