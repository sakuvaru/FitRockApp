// common
import { Component, Input, Output, OnInit, EventEmitter, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../core';

// required by component

@Component({
    selector: 'edit-dialog',
    templateUrl: 'edit-dialog.component.html'
})
export class EditDialogComponent extends BaseComponent implements OnInit {

    constructor(
        private viewContainerRef: ViewContainerRef,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService)
    }

    ngOnInit(): void {

    }

    openPrompt(): void {
        this.dependencies.tdServices.dialogService.openPrompt({
            message: 'This is how simple it is to create a prompt with this wrapper service. Prompt something.',
            disableClose: false, // defaults to false
            viewContainerRef: this.viewContainerRef, //OPTIONAL
            title: 'Prompt', //OPTIONAL, hides if not provided
            value: 'Prepopulated value', //OPTIONAL
            cancelButton: 'Cancel', //OPTIONAL, defaults to 'CANCEL'
            acceptButton: 'Ok', //OPTIONAL, defaults to 'ACCEPT'
        }).afterClosed().subscribe((newValue: string) => {
            if (newValue) {
                // DO SOMETHING
                console.log(newValue);
            } else {
                // DO SOMETHING ELSE
            }
        });
    }
}