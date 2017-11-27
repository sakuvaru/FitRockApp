import { Directive, ElementRef, Input, OnInit, Renderer2, OnChanges, SimpleChanges } from '@angular/core';
import { DataFormComponent } from '../data-form.component';

// common
import { BaseWebComponent } from '../../base-web-component.class';

@Directive({
    selector: '[dataFormDeleteButton]',
})
export class DataFormDeleteButtonDirective extends BaseWebComponent implements OnInit, OnChanges {

    @Input() dataForm: DataFormComponent;

    private initialized: boolean = false;

    constructor(
        private elem: ElementRef,
        private renderer: Renderer2
    ) {
        super();
    }

    ngOnInit() {
        this.initDirective();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.initDirective();
    }

    private initDirective(): void {
        if (!this.dataForm || this.initialized) {
            // form is not yet ready or was already initialized
            return;
        }

        if (!(this.dataForm instanceof DataFormComponent)) {
            throw Error(`Data form save directive failed because data form is not set or is of improper type`);
        }

        // initialize directive only once
        this.initialized = true;

        // listen to clicks
        this.renderer.listen(this.elem.nativeElement, 'click', (event) => {
            this.handleButtonClick();
        });
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
