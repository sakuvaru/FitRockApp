import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef, OnChanges } from '@angular/core';
import { TdDialogService } from '@covalent/core';

import { LocalizationService } from '../../lib/localization';
import { BaseWebComponent } from '../base-web-component.class';
import { Subject } from 'rxjs/Rx';

@Component({
    selector: 'delete-button',
    templateUrl: 'delete-button.component.html'
})
export class DeleteButtonComponent extends BaseWebComponent implements OnInit, OnChanges {

    private titleText: string;
    private messageText: string;
    private cancelText: string;
    private confirmText: string;
    public tooltipText: string;

    private confirmSubject = new Subject<void>();

    private subscribed: boolean = false;

    constructor(
        private dialogService: TdDialogService,
        private viewContainerRef: ViewContainerRef,
        private localizationService: LocalizationService
    ) {
        super();
    }

    @Input() color: 'none' | 'warn' | 'accent' | 'primary' = 'none';

    @Input() mode: 'button' | 'simple' = 'button';

    @Input() enableConfirm: boolean;

    @Output() confirm = new EventEmitter();

    ngOnInit() {
        this.initSubscription();

        this.localizationService.get('webComponents.buttons.deleteButton.message').map(text => this.messageText = text)
            .zip(this.localizationService.get('webComponents.buttons.deleteButton.title').map(text => this.titleText = text))
            .zip(this.localizationService.get('webComponents.buttons.deleteButton.cancel').map(text => this.cancelText = text))
            .zip(this.localizationService.get('webComponents.buttons.deleteButton.confirm').map(text => this.confirmText = text))
            .zip(this.localizationService.get('webComponents.buttons.deleteButton.tooltip').map(text => this.tooltipText = text))
            .takeUntil(this.ngUnsubscribe)
            .subscribe();
    }

    ngOnChanges() {
        this.initSubscription();
    }

    private initSubscription(): void {
        if (this.enableConfirm && !this.subscribed) {
            this.confirmSubject.switchMap(() => {
                return this.dialogService.openConfirm({
                    message: this.messageText,
                    disableClose: false, // defaults to false
                    viewContainerRef: this.viewContainerRef, // OPTIONAL
                    title: this.titleText, // OPTIONAL, hides if not provided
                    cancelButton: this.cancelText, // OPTIONAL, defaults to 'CANCEL'
                    acceptButton: this.confirmText, // OPTIONAL, defaults to 'ACCEPT'
                }).afterClosed()
                    .map((accept: boolean) => {
                        if (accept) {
                            this.confirm.emit();
                        } else {
                            // user did not accepted delete
                        }
                    });
            })
                .takeUntil(this.ngUnsubscribe)
                .subscribe();

                this.subscribed = true;
        } else {
            // unsubscribe otherwise
            this.confirmSubject.unsubscribe();
            this.subscribed = false;
        }
    }

    private openConfirm(): void {
        if (this.confirmSubject && this.subscribed) {
            this.confirmSubject.next();
        }
    }

    public handleClick(event: any): void {
        event.stopPropagation(); // prevents issues if the clicked linked is within another link

        // confirmation not required
        if (!this.enableConfirm) {
            this.confirm.emit();
            return;
        } else {
            this.openConfirm();
        }
    }
}
