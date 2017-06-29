import { Injectable, Injector } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';

// Components's common services
import { AuthService } from '../../../lib/auth';
import { TdMediaService, TdLoadingService, TdDialogService } from '@covalent/core';
import { SharedService } from '../shared-service/shared.service';
import { RepositoryClient } from '../../../lib/repository';

// Services
import { UserService, ExerciseCategoryService, ExerciseService, LogService, WorkoutCategoryService, WorkoutExerciseService, WorkoutService } from '../../services';

// Angular material
import { MdSnackBar } from '@angular/material';

// Translation service
import { TranslateService } from '@ngx-translate/core';

// Web component services
import { DataTableService } from '../../../web-components/data-table';
import { DynamicFormService } from '../../../web-components/dynamic-form';

/// Use this class to define shared services that should be available for all conmponents
/// This is so that each component does not have to define all common dependencies, but only the ones it needs
@Injectable()
export class ComponentDependencyService {

    // url handling
    public router: Router;

    public itemServices: ItemServices;
    public coreServices: CoreServices;
    public webComponentServices: WebComponentServices;
    public mdServices: MdServices;
    public tdServices: TdServices;
    
    constructor(private injector: Injector) {
        // use Angular's injector to get service instances
        this.router = injector.get(Router);

        // core services
        this.coreServices = new CoreServices();
        this.coreServices.authService = injector.get(AuthService);
        this.coreServices.repositoryClient = injector.get(RepositoryClient);
        this.coreServices.translateService = injector.get(TranslateService);
        this.coreServices.sharedService = injector.get(SharedService);

        //td services (teradata covalent)
        this.tdServices = new TdServices();
        this.tdServices.dialogService = injector.get(TdDialogService);
        this.tdServices.loadingService = injector.get(TdLoadingService);
        this.tdServices.mediaService = injector.get(TdMediaService);

        // md services (material design)
        this.mdServices = new MdServices();
        this.mdServices.snackbarService = injector.get(MdSnackBar);

        // web component services
        this.webComponentServices = new WebComponentServices();
        this.webComponentServices.dataTableService = injector.get(DataTableService);
        this.webComponentServices.dynamicFormService = injector.get(DynamicFormService);

        // item services
        this.itemServices = new ItemServices();
        this.itemServices.userService = injector.get(UserService);
        this.itemServices.logService = injector.get(LogService);
        this.itemServices.workoutService = injector.get(WorkoutService);
        this.itemServices.workoutCategoryService = injector.get(WorkoutCategoryService);
        this.itemServices.workoutExerciseService = injector.get(WorkoutExerciseService);
        this.itemServices.exerciseService = injector.get(ExerciseService);
        this.itemServices.exerciseCategoyService = injector.get(ExerciseCategoryService);
    }
}

export class WebComponentServices {
    public dataTableService: DataTableService;
    public dynamicFormService: DynamicFormService;
}

export class CoreServices {
    public repositoryClient: RepositoryClient;
    public authService: AuthService;
    public sharedService: SharedService;
    public translateService: TranslateService;
}

export class MdServices {
    public snackbarService: MdSnackBar
}

export class TdServices {
    public dialogService: TdDialogService;
    public mediaService: TdMediaService;
    public loadingService: TdLoadingService;
}

export class ItemServices {
    public userService: UserService;
    public logService: LogService;
    public workoutService: WorkoutService;
    public workoutCategoryService: WorkoutCategoryService;
    public workoutExerciseService: WorkoutExerciseService;
    public exerciseService: ExerciseService;
    public exerciseCategoyService: ExerciseCategoryService;
}