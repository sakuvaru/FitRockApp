import { Injectable, Injector } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { AppData } from './app-data.class';

// Comnponent's common services
import { AuthService } from '../auth/auth.service';
import { TdMediaService } from '@covalent/core';
import { AppDataService } from './app-data.service';
import { TdLoadingService } from '@covalent/core';

/// Use this class to define shared services that should be available for all conmponents
/// This is so that each component does not have to define all common dependencies, but only the ones it needs
@Injectable()
export class ComponentDependencyService {

    public authService: AuthService;
    public mediaService: TdMediaService;
    public appDataService: AppDataService;
    public loadingService: TdLoadingService;

    constructor(private injector: Injector) {
        // use Angular's injector to get service instances
        this.authService = injector.get(AuthService);
        this.mediaService = injector.get(TdMediaService);
        this.appDataService = injector.get(AppDataService);
        this.loadingService = injector.get(TdLoadingService);
    }
}