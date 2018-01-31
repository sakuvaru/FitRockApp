import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';

import { BaseWebComponent } from '../../base-web-component.class';

export class DismissableMessageComponent extends BaseWebComponent implements OnInit, OnChanges {

    private readonly dismissStoragePrefix: string = 'dismissableMessage_';

    private isDismissed: boolean = false;
    
    /**
     * If set, message can be dismissed (closed). This expects an unique string
     * so that the same string is not shown again
     */
    @Input() dismissCode: string;

    public get showMessage(): boolean {
        return !this.isDismissed;
    }

    public get showDismiss(): boolean {
        return !(!this.dismissCode);
    }

    constructor(
    ) { super();
    }

    ngOnInit(): void {
        this.calculateDismiss();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.calculateDismiss();
    }

    handleClose(): void {
        if (!this.dismissCode) {
            console.warn('Could not dissmiss message because no code is set');
            return;
        }
        this.dismiss(this.dismissCode);
    }

    private getStorageKey(code: string): string {
        return this.dismissStoragePrefix + code;
    }

    private dismiss(code: string): void {
        localStorage.setItem(this.getStorageKey(code), '1');
    }

    private getIsDismissed(code: string): boolean {
        return localStorage.getItem(this.getStorageKey(code)) === '1' ? true : false;
    }

    private calculateDismiss(): void {
        if (this.dismissCode) {
            this.isDismissed = this.getIsDismissed(this.dismissCode);
        }
    }   
}
