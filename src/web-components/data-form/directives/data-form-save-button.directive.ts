import { Directive, ElementRef, Input, OnInit, Renderer2, OnChanges, SimpleChanges } from '@angular/core';
import { DataFormComponent } from '../data-form.component';

// common
import { BaseWebComponent } from '../../base-web-component.class';

@Directive({
    selector: '[dataFormSaveButton]',
})
export class DataFormSaveButtonDirective extends BaseWebComponent implements OnInit, OnChanges {

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
