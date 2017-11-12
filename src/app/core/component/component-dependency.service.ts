import { Injectable, Injector, } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

// Components's common services
import { AuthService } from '../../../lib/auth';
import { TdMediaService, TdLoadingService, TdDialogService } from '@covalent/core';
import { SharedService } from '../services/shared.service';
import { AuthenticatedUserService } from '../services/authenticated-user.service';
import { RepositoryClient } from '../../../lib/repository';

// Helpers
import { guidHelper, numberHelper, observableHelper, stringHelper, GuidHelper, NumberHelper, ObservableHelper, StringHelper } from '../../../lib/utilities';

// Services
import { UserService, ExerciseCategoryService, ExerciseService, LogService, WorkoutCategoryService,
     WorkoutExerciseService, WorkoutService, DietCategoryService, DietFoodService, DietService,
    FoodCategoryService, FoodService, FoodUnitService, ProgressItemService, ProgressItemTypeService,
   ChatMessageService, FeedService, FileService, AppointmentService, LocationService, ProgressItemUnitService,
   ServerService
 } from '../../services';

// Angular material
import { MatSnackBar, MatDialog } from '@angular/material';

// Translation service
import { TranslateService } from '@ngx-translate/core';

// moment js
import * as moment from 'moment';

// Web component services
import { DataListService, DynamicFormService, GalleryService, GraphService,
    LoadMoreService, UploaderService
} from '../../web-component-services';

// Models
import { User } from '../../models/';

/// Use this class to define shared services that should be available for all conmponents
/// This is so that each component does not have to define all common dependencies, but only the ones it needs
@Injectable()
export class ComponentDependencyService {

    /**
     * Current authenticated user 
     * Has to be initialized right after the user is authenticated 
     */
    public authenticatedUserService: AuthenticatedUserService;

    // url handling
    public router: Router;

    public itemServices: ItemServices;
    public fileService: FileService;
    public coreServices: CoreServices;
    public webComponentServices: WebComponentServices;
    public mdServices: MdServices;
    public tdServices: TdServices;
    public helpers: Helpers;

    constructor(private injector: Injector) {
        // use Angular's injector to get service instances
        this.router = injector.get(Router);

        // authenticated user service (note: has to be initialized when logging in)
        this.authenticatedUserService = new AuthenticatedUserService();

        // core services
        this.coreServices = new CoreServices();
        this.coreServices.serverService = injector.get(ServerService);
        this.coreServices.authService = injector.get(AuthService);
        this.coreServices.repositoryClient = injector.get(RepositoryClient);
        this.coreServices.translateService = injector.get(TranslateService);
        this.coreServices.sharedService = injector.get(SharedService);
        this.coreServices.moment = moment;
        this.coreServices.momentLanguage = moment;

        // helpers
        this.helpers = new Helpers();
        this.helpers.guidHelper = guidHelper;
        this.helpers.numberHelper = numberHelper;
        this.helpers.observableHelper = observableHelper;
        this.helpers.stringHelper = stringHelper;

        // td services (teradata covalent)
        this.tdServices = new TdServices();
        this.tdServices.dialogService = injector.get(TdDialogService);
        this.tdServices.loadingService = injector.get(TdLoadingService);
        this.tdServices.mediaService = injector.get(TdMediaService);

        // md services (material design)
        this.mdServices = new MdServices();
        this.mdServices.snackbarService = injector.get(MatSnackBar);
        this.mdServices.dialogService = injector.get(MatDialog);

        // web component services
        this.webComponentServices = new WebComponentServices();
        this.webComponentServices.dataListService = injector.get(DataListService);
        this.webComponentServices.dynamicFormService = injector.get(DynamicFormService);
        this.webComponentServices.loadMoreService = injector.get(LoadMoreService);
        this.webComponentServices.uploaderService = injector.get(UploaderService);
        this.webComponentServices.galleryService = injector.get(GalleryService);
        this.webComponentServices.graphService = injector.get(GraphService);

        // item services
        this.itemServices = new ItemServices();
        this.itemServices.userService = injector.get(UserService);
        this.itemServices.logService = injector.get(LogService);

        // workout services
        this.itemServices.workoutService = injector.get(WorkoutService);
        this.itemServices.workoutCategoryService = injector.get(WorkoutCategoryService);
        this.itemServices.workoutExerciseService = injector.get(WorkoutExerciseService);
        this.itemServices.exerciseService = injector.get(ExerciseService);
        this.itemServices.exerciseCategoyService = injector.get(ExerciseCategoryService);

        // diet services
        this.itemServices.dietService = injector.get(DietService);
        this.itemServices.dietCategoryService = injector.get(DietCategoryService);
        this.itemServices.dietFoodService = injector.get(DietFoodService);
        this.itemServices.foodCategoryService = injector.get(FoodCategoryService);
        this.itemServices.foodService = injector.get(FoodService);
        this.itemServices.foodUnitService = injector.get(FoodUnitService);

        // progress services
        this.itemServices.progressItemService = injector.get(ProgressItemService);
        this.itemServices.progressItemTypeService = injector.get(ProgressItemTypeService);
        this.itemServices.progressItemUnitService = injector.get(ProgressItemUnitService);

        // chat services
        this.itemServices.chatMessageService = injector.get(ChatMessageService);

        // feed services
        this.itemServices.feedService = injector.get(FeedService);

        // file service
        this.fileService = injector.get(FileService);

        // appointments
        this.itemServices.appointmentService = injector.get(AppointmentService);

        // locations
        this.itemServices.locationService = injector.get(LocationService);
    }
}

export class WebComponentServices {
    public dataListService: DataListService;
    public dynamicFormService: DynamicFormService;
    public loadMoreService: LoadMoreService;
    public uploaderService: UploaderService;
    public galleryService: GalleryService;
    public graphService: GraphService;
}

export class CoreServices {
    public serverService: ServerService;
    public repositoryClient: RepositoryClient;
    public authService: AuthService;
    public sharedService: SharedService;
    public translateService: TranslateService;
    public moment: (inp?: moment.MomentInput, format?: moment.MomentFormatSpecification, strict?: boolean) => moment.Moment;
    public momentLanguage: (inp?: moment.MomentInput, format?: moment.MomentFormatSpecification, language?: string, strict?: boolean) => moment.Moment;
}

export class MdServices {
    public snackbarService: MatSnackBar;
    public dialogService: MatDialog;
}

export class TdServices {
    public dialogService: TdDialogService;
    public mediaService: TdMediaService;
    public loadingService: TdLoadingService;
}

export class ItemServices {
    // core
    public userService: UserService;
    public logService: LogService;

    // workout
    public workoutService: WorkoutService;
    public workoutCategoryService: WorkoutCategoryService;
    public workoutExerciseService: WorkoutExerciseService;
    public exerciseService: ExerciseService;
    public exerciseCategoyService: ExerciseCategoryService;

    // diets
    public dietService: DietService;
    public dietFoodService: DietFoodService;
    public dietCategoryService: DietCategoryService;
    public foodService: FoodService;
    public foodUnitService: FoodUnitService;
    public foodCategoryService: FoodCategoryService;

    // progress
    public progressItemService: ProgressItemService;
    public progressItemTypeService: ProgressItemTypeService;
    public progressItemUnitService: ProgressItemUnitService;

    // chat
    public chatMessageService: ChatMessageService;

    // feed
    public feedService: FeedService;

    // appointments
    public appointmentService: AppointmentService;

    // locations
    public locationService: LocationService;
}

export class Helpers {
    public stringHelper: StringHelper;
    public numberHelper: NumberHelper;
    public guidHelper: GuidHelper;
    public observableHelper: ObservableHelper;
}
