// common
import { Component, Input, Output, OnInit, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';

import { TdLoadingService } from '@covalent/core';

@Component({
    selector: 'loader',
    templateUrl: 'loader.component.html'
})
export class LoaderComponent implements OnChanges{
    @Input() name: string;
    @Input() enabled: boolean = true;

    constructor(
        private loadingService: TdLoadingService
    ) {
    }

    ngOnChanges(changes: SimpleChanges) {
        var enabled = changes.enabled;
        if (enabled) {
            if (enabled.currentValue !== true) {
                // IMPORTANT
                // use timeout to ensure that loader is properly disabled
                // this is to prevent an issue when loader gets stucked because resolve method is called
                // immediately after register
                setTimeout(() => {
                    this.loadingService.resolve(this.name);
                }, 200);
            }
            else {
                this.loadingService.register(this.name);
            }
        }
    }
}