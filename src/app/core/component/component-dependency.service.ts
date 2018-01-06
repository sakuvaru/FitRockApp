import { Injectable, Injector } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { TdDialogService, TdLoadingService, TdMediaService } from '@covalent/core';

import { AuthService } from '../../../lib/auth';
import { LocalizationService } from '../../../lib/localization';
import { RepositoryClient } from '../../../lib/repository';
import {
    GuidHelper,
    guidHelper,
    NumberHelper,
    numberHelper,
    ObservableHelper,
    observableHelper,
    StringHelper,
    stringHelper,
} from '../../../lib/utilities';
import {
    AppointmentService,
    ChatMessageService,
    DietCategoryService,
    DietFoodService,
    DietService,
    ExerciseCategoryService,
    ExerciseService,
    FeedService,
    FileService,
    FoodCategoryService,
    FoodDishService,
    FoodService,
    FoodUnitService,
    LocationService,
    LogService,
    ProgressItemService,
    ProgressItemTypeService,
    ProgressItemUnitService,
    ServerService,
    UserService,
    WorkoutCategoryService,
    WorkoutExerciseService,
    WorkoutService,
} from '../../services';
import {
    CalendarService,
    DataFormService,
    DataTableService,
    GalleryService,
    GraphService,
    LoadMoreService,
    UploaderService,
} from '../../web-component-services';
import {
    AuthenticatedUserService,
    CurrentLanguageService,
    NavigateService,
    RememberService,
    SharedService,
    SystemService,
    TimeService,
    LocalizationHelperService
} from '../services';

@Injectable()
export class ComponentDependencyService {

    /**
     * Current authenticated user 
     * Has to be initialized right after the user is authenticated 
     */
    public authenticatedUserService: AuthenticatedUserService;

    public itemServices: ItemServices;
    public fileService: FileService;
    public coreServices: CoreServices;
    public webComponentServices: WebComponentServices;
    public mdServices: MdServices;
    public tdServices: TdServices;
    public helpers: Helpers;

    constructor(private injector: Injector) {
        // authenticated user service (note: has to be initialized when logging in)
        this.authenticatedUserService = injector.get(AuthenticatedUserService);

        // core services
        this.coreServices = new CoreServices();
        this.coreServices.systemService = injector.get(SystemService);
        this.coreServices.currentLanguageService = injector.get(CurrentLanguageService);
        this.coreServices.serverService = injector.get(ServerService);
        this.coreServices.authService = injector.get(AuthService);
        this.coreServices.repositoryClient = injector.get(RepositoryClient);
        this.coreServices.localizationService = injector.get(LocalizationService);
        this.coreServices.sharedService = injector.get(SharedService);
        this.coreServices.timeService = injector.get(TimeService);
        this.coreServices.rememberService = injector.get(RememberService);
        this.coreServices.navigateService = injector.get(NavigateService);
        this.coreServices.localizationHelperService = injector.get(LocalizationHelperService);

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
        this.webComponentServices.loadMoreService = injector.get(LoadMoreService);
        this.webComponentServices.uploaderService = injector.get(UploaderService);
        this.webComponentServices.galleryService = injector.get(GalleryService);
        this.webComponentServices.graphService = injector.get(GraphService);
        this.webComponentServices.dataTableService = injector.get(DataTableService);
        this.webComponentServices.dataFormService = injector.get(DataFormService);
        this.webComponentServices.calendarService = injector.get(CalendarService);

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
    public loadMoreService: LoadMoreService;
    public uploaderService: UploaderService;
    public galleryService: GalleryService;
    public graphService: GraphService;
    public dataTableService: DataTableService;
    public dataFormService: DataFormService;
    public calendarService: CalendarService;
}

export class CoreServices {
    public systemService: SystemService;
    public currentLanguageService: CurrentLanguageService;
    public serverService: ServerService;
    public repositoryClient: RepositoryClient;
    public authService: AuthService;
    public sharedService: SharedService;
    public localizationService: LocalizationService;
    public timeService: TimeService;
    public rememberService: RememberService;
    public navigateService: NavigateService;
    public localizationHelperService: LocalizationHelperService;
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

    // foods
    public foodService: FoodService;
    public foodUnitService: FoodUnitService;
    public foodCategoryService: FoodCategoryService;
    public foodDishService: FoodDishService;

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
