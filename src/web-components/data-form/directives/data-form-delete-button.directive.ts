import { Directive, ElementRef, Input, OnInit, Renderer2, OnChanges, SimpleChanges } from '@angular/core';
import { DataFormComponent } from '../data-form.component';

// common
import { BaseWebComponent } from '../../base-web-component.class';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Directive({
    selector: '[dataFormDeleteButton]',
})
export class DataFormDeleteButtonDirective extends BaseWebComponent implements AfterViewInit {

    @Input() dataForm: DataFormComponent;

    private initialized: boolean = false;

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
        if (!this.dataForm || this.initialized) {
            // form is not yet ready or was already initialized
            return;
        }

        if (!(this.dataForm instanceof DataFormComponent)) {
            throw Error(`Data form delete directive failed because data form is not set or is of improper type`);
        }

        // initialize directive only once
        this.initialized = true;

        // listen to clicks
        const button = this.elem.nativeElement.querySelector('button');
        const a = this.elem.nativeElement.querySelector('a');

        const elem = button ? button : a;

        // by wrapping elem in div it will work universally
        this.renderer.listen(elem, 'click', (event) => {
            this.handleButtonClick();
        });
    }

    private wrapElemInDivAndReturnIt(): any {
        // Get parent of the original input element
        const parent = this.elem.nativeElement.parentNode;

        // Create a div
        const divElement = this.renderer.createElement('div');

        // Render div as inline
        this.renderer.setStyle(divElement, 'display', 'inline');
        this.renderer.setStyle(divElement, 'position', 'relative');

        // Add the div, just before the input
        this.renderer.insertBefore(parent, divElement, this.elem.nativeElement);

        // Remove the input
        this.renderer.removeChild(parent, this.elem.nativeElement);

        // Re-add it inside the div
        this.renderer.appendChild(divElement, this.elem.nativeElement);

        return divElement;
    }

    private handleButtonClick(): void {
        // make sure that input is set and contains reference to data form component
        if (!this.dataForm || !(this.dataForm instanceof DataFormComponent)) {
            throw Error(`Data form delete directive failed because data form is not set or is of improper type`);
        }

        if (this.dataForm.isDeleteEnabled) {
            this.dataForm.handleDeleteItem();
        } else {
            console.warn(`Cannot delete item using form because delete is not enabled`);
            return;
        }
    }

}
