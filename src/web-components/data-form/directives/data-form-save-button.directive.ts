import { Directive, ElementRef, Input, OnInit, Renderer2, OnChanges, SimpleChanges } from '@angular/core';
import { DataFormComponent } from '../data-form.component';

// common
import { BaseWebComponent } from '../../base-web-component.class';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Directive({
    selector: '[dataFormSaveButton]',
})
export class DataFormSaveButtonDirective extends BaseWebComponent implements AfterViewInit {

    @Input() dataForm: DataFormComponent;

    private initialized: boolean = false;

    /**
     * Indicates if form is valid and can be saved
     */
    private valid: boolean = false;

    constructor(
        private elem: ElementRef,
        private renderer: Renderer2
    ) {
        super();
    }

    ngAfterViewInit() {
        this.initDirective();
    }

    private initDirective(): void {
        if (!this.dataForm || this.initialized || !this.elem) {
            // form is not yet ready or was already initialized
            return;
        }

        if (!(this.dataForm instanceof DataFormComponent)) {
            throw Error(`Data form save directive failed because data form is not set or is of improper type`);
        }

        // initialize directive only once
        this.initialized = true;

        // listen to clicks
        // find button because it is possible that nativeElement itself is not a button or link
        const button = this.elem.nativeElement.querySelector('button');
        const a = this.elem.nativeElement.querySelector('a');

        const elem = button ? button : a;

        // use either the button or native element itself (which should be button)
        this.renderer.listen(elem ? elem : this.elem.nativeElement, 'click', (event) => {
            this.handleButtonClick();
        });

        this.dataForm.formStatusChange
            .map(valid => {
                this.valid = valid;

                if (this.valid) {
                    // remove disabled attribute
                    this.renderer.removeAttribute(this.elem.nativeElement, 'disabled');
                } else {
                    // set disabled attribute
                    this.renderer.setAttribute(this.elem.nativeElement, 'disabled', 'true');
                }
            })
            .takeUntil(this.ngUnsubscribe)
            .subscribe();
    }

    private handleButtonClick(): void {
        // make sure that input is set and contains reference to data form component
        if (!this.dataForm || !(this.dataForm instanceof DataFormComponent)) {
            throw Error(`Data form save directive failed because data form is not set or is of improper type`);
        }

        if (!this.valid) {
            console.warn('Cannot save form because its not valid');
            return;
        }

        if (this.dataForm.isEditForm) {
            this.dataForm.handleEditItem();
        } else if (this.dataForm.isInsertForm) {
            this.dataForm.handleInsertItem();
        } else {
            throw Error(`Unsupported save action`);
        }
    }

}
