import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { TableBoxConfig } from 'web-components/boxes';

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

    public readonly googleApiKey: string = AppConfig.GoogleApiKey;

    public location?: Location;
    public locationTableBox?: TableBoxConfig;

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

    private getItemObservable(): Observable<void> {
        return this.dependencies.itemServices.locationService.item()
            .byId(this.locationId)
            .get()
            .map(response => {
                this.location = response.item;

                if (this.location) {
                    this.loadLocation.next(this.location);
                }
            });
    }
}
