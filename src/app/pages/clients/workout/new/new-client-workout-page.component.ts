import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ComponentDependencyService } from '../../../../core';
import { BaseClientsPageComponent } from '../../base-clients-page.component';
import { NewClientWorkoutMenuItems } from '../../menu.items';

@Component({
    templateUrl: 'new-client-workout-page.component.html'
})
export class NewClientWorkoutPageComponent extends BaseClientsPageComponent implements OnInit {

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService, activatedRoute);
    }

    ngOnInit(): void {
        super.ngOnInit();

        super.subscribeToObservable(this.clientChange.map(client => {
            this.setConfig({
                componentTitle: { key: 'module.clients.workout.newWorkout' },
                menuItems: new NewClientWorkoutMenuItems(client.id).menuItems,
                menuTitle: {
                    key: 'module.clients.viewClientSubtitle',
                    data: { 'fullName': client.getFullName() }
                },
                menuAvatarUrl: client.getAvatarOrGravatarUrl()
            });
        }));
    }
}
