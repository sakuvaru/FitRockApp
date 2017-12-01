// common
import { Component, Input, Output, EventEmitter, ViewContainerRef, OnInit } from '@angular/core';
import { TdDialogService } from '@covalent/core';
import { LocalizationService } from '../../lib/localization';
import { BaseWebComponent } from '../base-web-component.class';

@Component({
    selector: 'delete-button',
    templateUrl: 'delete-button.component.html'
})
export class DeleteButtonComponent extends BaseWebComponent implements OnInit {

    private titleText: string;
    private messageText: string;
    private cancelText: string;
    private confirmText: string;
    public tooltipText: string;

    constructor(
        private dialogService: TdDialogService,
        private viewContainerRef: ViewContainerRef,
        private localizationService: LocalizationService
    ) {
        super();
    }

    @Input() color: 'none' | 'warn' | 'accent' | 'primary' = 'none';

    @Input() mode: 'button' | 'simple' = 'button';

    @Output() confirm = new EventEmitter();

    ngOnInit() {
        this.localizationService.get('webComponents.buttons.deleteButton.message').map(text => this.messageText = text)
            .zip(this.localizationService.get('webComponents.buttons.deleteButton.title').map(text => this.titleText = text))
            .zip(this.localizationService.get('webComponents.buttons.deleteButton.cancel').map(text => this.cancelText = text))
            .zip(this.localizationService.get('webComponents.buttons.deleteButton.confirm').map(text => this.confirmText = text))
            .zip(this.localizationService.get('webComponents.buttons.deleteButton.tooltip').map(text => this.tooltipText = text))
            .takeUntil(this.ngUnsubscribe)
            .subscribe();
    }

    public handleClick(event: any): void {
        event.stopPropagation(); // prevents issues if the clicked linked is within another link

        this.dialogService.openConfirm({
            message: this.messageText,
            disableClose: false, // defaults to false
            viewContainerRef: this.viewContainerRef, // OPTIONAL
            title: this.titleText, // OPTIONAL, hides if not provided
            cancelButton: this.cancelText, // OPTIONAL, defaults to 'CANCEL'
            acceptButton: this.confirmText, // OPTIONAL, defaults to 'ACCEPT'
        }).afterClosed().subscribe((accept: boolean) => {
            if (accept) {
                this.confirm.emit();
            } else {
                // user did not accepted delete
            }
        });
    }
}
