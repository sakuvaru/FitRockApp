import { Injectable, Injector } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';

// Components's common services
import { AuthService }  from '../../../lib/auth';
import { TdMediaService } from '@covalent/core';
import { SharedService } from '../shared-service/shared.service';
import { TdLoadingService } from '@covalent/core';
import { RepositoryClient } from '../../../lib/repository';

// Services
import { UserService } from '../../services/user.service';
import { LogService } from '../../services/log.service';

// Angular material
import { MdSnackBar } from '@angular/material';

// Translation service
import { TranslateService } from '@ngx-translate/core';

// Web component services
import { DataTableService } from '../../../lib/web-components';

/// Use this class to define shared services that should be available for all conmponents
/// This is so that each component does not have to define all common dependencies, but only the ones it needs
@Injectable()
export class ComponentDependencyService {

    // url handling
    public router: Router;

    // repository client
    public repositoryClient: RepositoryClient;

    // common services
    public authService: AuthService;
    public mediaService: TdMediaService;
    public sharedService: SharedService;
    public loadingService: TdLoadingService;
    public snackbarService: MdSnackBar
    public translateService: TranslateService;

    // web components
    public dataTableService: DataTableService;

    // services
    public userService: UserService;
    public logService: LogService;

    constructor(private injector: Injector) {
        // use Angular's injector to get service instances
        this.router = injector.get(Router);

        this.authService = injector.get(AuthService);
        this.mediaService = injector.get(TdMediaService);
        this.sharedService = injector.get(SharedService);
        this.loadingService = injector.get(TdLoadingService);
        this.repositoryClient = injector.get(RepositoryClient);
        this.snackbarService = injector.get(MdSnackBar);

        this.userService = injector.get(UserService);
        this.logService = injector.get(LogService);

        this.translateService = injector.get(TranslateService);

        this.dataTableService = injector.get(DataTableService);
    }
}