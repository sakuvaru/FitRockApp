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
import { UserService, ExerciseCategoryService, ExerciseService, LogService, WorkoutCategoryService, WorkoutExerciseService, WorkoutService } from '../../services';

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

    // web component services
    public dataTableService: DataTableService;

    // data/item services
    public itemServices: ItemServices;

    constructor(private injector: Injector) {
        // use Angular's injector to get service instances
        this.router = injector.get(Router);

        // general services
        this.authService = injector.get(AuthService);
        this.mediaService = injector.get(TdMediaService);
        this.sharedService = injector.get(SharedService);
        this.loadingService = injector.get(TdLoadingService);
        this.repositoryClient = injector.get(RepositoryClient);
        this.snackbarService = injector.get(MdSnackBar);
        this.translateService = injector.get(TranslateService);
        this.dataTableService = injector.get(DataTableService);

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

export class ItemServices{
    public userService: UserService;
    public logService: LogService; 
    public workoutService: WorkoutService;
    public workoutCategoryService: WorkoutCategoryService;
    public workoutExerciseService: WorkoutExerciseService;
    public exerciseService: ExerciseService;
    public exerciseCategoyService: ExerciseCategoryService;
}