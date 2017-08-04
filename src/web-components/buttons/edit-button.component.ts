// common
import { Component, Input, Output, EventEmitter, ViewContainerRef, OnInit } from '@angular/core';
import { TdDialogService } from '@covalent/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseWebComponent } from '../base-web-component.class';

@Component({
    selector: 'edit-button',
    templateUrl: 'edit-button.component.html'
})
export class EditButtonComponent extends BaseWebComponent implements OnInit {

    private tooltipText: string;

    constructor(
        private dialogService: TdDialogService,
        private viewContainerRef: ViewContainerRef,
        private translateService: TranslateService
    ) { super()
    }

    @Input() color: 'none' | 'warn' | 'accent' | 'primary' = 'none';

    @Output() confirm = new EventEmitter();

    ngOnInit() {
        this.translateService.get('webComponents.buttons.editButton.tooltip').subscribe(text => this.tooltipText = text);
    }
}