// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { BaseField } from '../../core/web-components/dynamic-form/base-field.class';
import { BaseComponent } from '../../core/base/base.component';
import { AppData } from '../../core/app-data.class';
import { ComponentDependencyService } from '../../core/component-dependency.service';
import { DataTableField } from '../../core/web-components/data-table/data-table-field.class';
import { DataTableConfig } from '../../core/web-components/data-table/data-table.config';
import { AlignEnum } from '../../core/web-components/data-table/align-enum';
import { WhereEquals, OrderBy, OrderByDescending, Limit, Include, IncludeMultiple } from '../../repository/models/options';

// required by component

@Component({
    templateUrl: 'sample.component.html'
})
export class SampleComponent extends BaseComponent {
    constructor(
        protected dependencies: ComponentDependencyService) {
        super(dependencies)
    }

    initAppData(): AppData {
        return new AppData({
            subTitle: "Sample subtitle"
        });
    }
}