import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { TdDialogService } from '@covalent/core';

import { LocalizationService } from '../../../lib/localization';
import { BaseWebComponent } from '../../base-web-component.class';

@Component({
    selector: 'edit-button',
    templateUrl: 'edit-button.component.html'
})
export class EditButtonComponent extends BaseWebComponent implements OnInit {

    public tooltipText: string;

    constructor(
        private dialogService: TdDialogService,
        private viewContainerRef: ViewContainerRef,
        private localizationService: LocalizationService
    ) { super();
    }

    @Input() color: 'none' | 'warn' | 'accent' | 'primary' = 'none';

    @Output() editAction = new EventEmitter();

    ngOnInit() {
        this.localizationService.get('webComponents.buttons.editButton.tooltip').subscribe(text => this.tooltipText = text);
    }

    public handleClick(event: any): void {
        event.stopPropagation(); // prevents issues if the clicked linked is within another link
        this.editAction.emit();
    }
}
