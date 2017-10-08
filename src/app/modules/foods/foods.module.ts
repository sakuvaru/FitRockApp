import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// core module
import { CoreModule } from '../../core';

// components
import { MyFoodsListComponent} from './list/my-foods-list.component';
import { AllFoodsListComponent } from './list/all-foods-list.component';
import { EditFoodComponent } from './edit/edit-food.component';
import { NewFoodComponent } from './new/new-food.component';
import { PreviewFoodComponent } from './view/preview-food.component';

// router
import { FoodsRouter } from './foods.routing';

// modules
import { SharedModule} from '../shared/shared.module';

@NgModule({
    imports: [
        CoreModule,
        CommonModule,
        FoodsRouter,
        SharedModule
    ],
    declarations: [
        MyFoodsListComponent,
        AllFoodsListComponent,
        EditFoodComponent,
        NewFoodComponent,
        PreviewFoodComponent
    ]
})
export class FoodsModule { }
