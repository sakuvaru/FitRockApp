import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { AppConfig } from '../../../config';
import { BaseModuleComponent, ComponentDependencyService } from '../../../core';
import { Location } from '../../../models';

@Component({
    selector: 'mod-preview-location',
    templateUrl: 'preview-location.component.html'
})
export class PreviewLocationComponent extends BaseModuleComponent implements OnInit, OnChanges {

    @Input() locationId: number;

    @Output() loadLocation = new EventEmitter<Location>();

    public location: Location;

    public googleApiKey: string = AppConfig.GoogleApiKey;

    constructor(
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService);
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.locationId) {
            super.subscribeToObservable(
                this.getItemObservable()
            );
        }
    }

    private getItemObservable(): Observable<any> {
        return this.dependencies.itemServices.locationService.item()
            .byId(this.locationId)
            .get()
            .map(response => {
                this.location = response.item;

                this.loadLocation.next(this.location);
            });
    }
}
