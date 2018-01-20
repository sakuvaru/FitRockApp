import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuardService } from '../../../lib/auth';
import { UrlConfig } from '../../config';
import { AdminLayoutComponent } from '../../layouts/admin-layout.component';
import { EditLocationPageComponent } from './edit/edit-location-page.component';
import { MyLocationsPageComponent } from './list/my-locations-page.component';
import { NewLocationPageComponent } from './new/new-location-page.component';
import { PreviewLocationPageComponent } from './view/preview-location-page.component';

@NgModule({
    declarations: [
    ],
    imports: [
        RouterModule.forChild([
            {
                path: UrlConfig.TrainerMasterPath, component: AdminLayoutComponent, canActivate: [AuthGuardService], children: [
                    {
                        path: 'locations', component: MyLocationsPageComponent
                    },
                    {
                        path: 'locations/new', component: NewLocationPageComponent
                    },
                    {
                        path: 'locations/edit/:id', component: EditLocationPageComponent
                    },
                    {
                        path: 'locations/view/:id', component: PreviewLocationPageComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class LocationRouter { }
