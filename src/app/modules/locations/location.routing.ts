import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// guard
import { AuthGuardService } from '../../../lib/auth';

// config
import { UrlConfig } from '../../core';

// layouts
import { SimpleLayoutComponent } from '../../layouts/simple-layout.component';
import { AdminLayoutComponent } from '../../layouts/admin-layout.component';

// components
import { NewLocationComponent } from './new/new-location.component';
import { MyLocationsComponent } from './list/my-locations.component';
import { EditLocationComponent } from './edit/edit-location.component';
import { PreviewLocationComponent } from './view/preview-location.component';

const routes: Routes = [
    {
        path: UrlConfig.TrainerMasterPath, component: AdminLayoutComponent, canActivate: [AuthGuardService], children: [
            { 
                path: 'locations', component: MyLocationsComponent
            },
            {
                path: 'locations/new', component: NewLocationComponent
            },
            {
                path: 'locations/edit/:id', component: EditLocationComponent
            },
            {
                path: 'locations/view/:id', component: PreviewLocationComponent
            }
        ]
    }
];

@NgModule({
    declarations: [
    ],
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class LocationRouter { }
