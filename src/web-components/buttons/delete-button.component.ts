// common
import { Component, Input, Output, EventEmitter, ViewContainerRef, OnInit } from '@angular/core';
import { TdDialogService } from '@covalent/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'delete-button',
    templateUrl: 'delete-button.component.html'
})
export class DeleteButtonComponent implements OnInit {

    private titleText: string;
    private messageText: string;
    private cancelText: string;
    private confirmText: string;

    constructor(
        private dialogService: TdDialogService,
        private viewContainerRef: ViewContainerRef,
        private translateService: TranslateService
    ) {
    }

    @Input() color: 'none' | 'warn' | 'accent' | 'primary' = 'warn';

    @Output() confirm = new EventEmitter();

    ngOnInit() {
        this.translateService.get('webComponents.buttons.deleteButton.message').subscribe(text => this.messageText = text);
        this.translateService.get('webComponents.buttons.deleteButton.title').subscribe(text => this.titleText = text);
        this.translateService.get('webComponents.buttons.deleteButton.cancel').subscribe(text => this.cancelText = text);
        this.translateService.get('webComponents.buttons.deleteButton.confirm').subscribe(text => this.confirmText = text);
    }

    private handleClick(): void {
        this.dialogService.openConfirm({
            message: this.messageText,
            disableClose: false, // defaults to false
            viewContainerRef: this.viewContainerRef, //OPTIONAL
            title: this.titleText, //OPTIONAL, hides if not provided
            cancelButton: this.cancelText, //OPTIONAL, defaults to 'CANCEL'
            acceptButton: this.confirmText, //OPTIONAL, defaults to 'ACCEPT'
        }).afterClosed().subscribe((accept: boolean) => {
            if (accept) {
                this.confirm.emit();
            } else {
                // user did not accepted delete
            }
        });
    }
}