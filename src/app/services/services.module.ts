import { NgModule } from '@angular/core';

// services to import
import { UserService, LogService, ExerciseCategoryService, ExerciseService, 
    WorkoutCategoryService, WorkoutExerciseService, WorkoutService, DietCategoryService,
    DietFoodService, DietService, FoodCategoryService, FoodService, FoodUnitService,
    ProgressItemService, ProgressItemTypeService, ChatMessageService, FeedService, FileService
 } from './index';

@NgModule({
    imports: [
    ],
    declarations: [
    ],
    providers: [
        LogService,
        UserService,
        ExerciseCategoryService,
        ExerciseService,
        WorkoutCategoryService,
        WorkoutExerciseService,
        WorkoutService,
        DietCategoryService,
        DietFoodService,
        DietService,
        FoodCategoryService,
        FoodService,
        FoodUnitService,
        ProgressItemService,
        ProgressItemTypeService,
        ChatMessageService,
        FeedService,
        FileService
    ]
})
export class ServicesModule { }