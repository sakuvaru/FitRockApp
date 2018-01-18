import { NgModule } from '@angular/core';

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
        FileService,
        ProgressItemUnitService,
        LocationService,
        AppointmentService,
        ServerService,
        FoodDishService
    ]
})
export class ServicesModule { }
