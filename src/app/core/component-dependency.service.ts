import { Injectable, Injector } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { AppData } from './app-data.class';
import { Router, ActivatedRoute } from '@angular/router';

// Comnponent's common services
import { AuthService } from './auth/auth.service';
import { TdMediaService } from '@covalent/core';
import { AppDataService } from './app-data.service';
import { TdLoadingService } from '@covalent/core';
import { RepositoryService } from '../repository/repository.service';

// Angular material
import { MdSnackBar } from '@angular/material';

/// Use this class to define shared services that should be available for all conmponents
/// This is so that each component does not have to define all common dependencies, but only the ones it needs
@Injectable()
export class ComponentDependencyService {

    public router: Router;
    public activatedRoute: ActivatedRoute;

    public authService: AuthService;
    public mediaService: TdMediaService;
    public appDataService: AppDataService;
    public loadingService: TdLoadingService;
    public repositoryService: RepositoryService;
    public snackbarService: MdSnackBar

    constructor(private injector: Injector) {
        // use Angular's injector to get service instances
        this.router = injector.get(Router);
        this.activatedRoute = injector.get(ActivatedRoute);

        this.authService = injector.get(AuthService);
        this.mediaService = injector.get(TdMediaService);
        this.appDataService = injector.get(AppDataService);
        this.loadingService = injector.get(TdLoadingService);
        this.repositoryService = injector.get(RepositoryService);

        this.snackbarService = injector.get(MdSnackBar);
    }
}