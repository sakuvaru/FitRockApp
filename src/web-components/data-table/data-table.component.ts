// common
import { Component, Input, ViewChild, OnInit, OnChanges, SimpleChanges, ElementRef, AfterViewInit } from '@angular/core';
import { BaseWebComponent } from '../base-web-component.class';
import { DataSource } from '@angular/cdk/collections';
import { guidHelper, observableHelper } from '../../lib/utilities';
import { FormControl } from '@angular/forms';

import { DataTableConfig } from './data-table.config';
import { DataTableSource } from './data-table-source.class';
import {
    DataTableField, DataTableFieldWrapper, DataTableButtonWrapper,
    DataTableButton, DataTableDeleteResponse, Filter, FilterWrapper, DataTableResponse,
    DataTableCountResponse
} from './data-table-models';

import { MatPaginator } from '@angular/material';
import { Observable } from 'rxjs/Rx';
import { MatSnackBar } from '@angular/material';
import { TdDialogService } from '@covalent/core';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'underscore';

@Component({
    selector: 'data-table',
    templateUrl: 'data-table.component.html'
})
export class DataTableComponent extends BaseWebComponent implements OnInit, OnChanges {

    /**
     * Graph configuration
     */
    @Input() config: DataTableConfig;

    /**
     * Indicates if loader is enabled
     */
    private loaderEnabled: boolean = false;

    /**
     * Identifier for buttons columns
     */
    private readonly buttonsColumnDef: string = '_buttons';

    /**
     * All filters
     */
    private filtersWrapper: FilterWrapper[] = [];

    /**
     * Temp variable to hold filters
     */
    private tempFiltersWrapper: FilterWrapper[] = [];

    /**
     * Guid of active filter
     */
    private activeFilterName?: string;

    /**
     * Displayed columns
     */
    get displayedColumns(): string[] {
        const fieldColumns = this.fieldsWrapper.map(m => m.nameDef);

        // add button at the end
        if (this.buttonsWrapper || this.config.deleteAction) {
            fieldColumns.push(this.buttonsColumnDef);
        }

        return fieldColumns;
    }

    /**
     * Gets all data table buttons 
     */
    private buttons: DataTableButton<any>[] = [];

    /**
     * Limit
     */
    private limit?: number = undefined;

    /**
     * Page size
     */
    private pageSize: number = 20;

    /**
     * Total number of items in db
     */
    private totalItems: number = 0;

    /**
     * Index of current page
     */
    private currentPage: number = 1;

    /**
     * Paginator indexes pages from 0
     */
    get paginatorPageIndex(): number {
        return this.currentPage - 1;
    }

    /**
     * Searched string
     */
    private search: string = '';

    /**
     * Fields wrapper
     */
    private fieldsWrapper: DataTableFieldWrapper[] = [];

    /**
     * Buttons wrapper
     */
    private buttonsWrapper?: DataTableButtonWrapper;

    /**
     * Data source
     */
    private dataSource?: DataSource<any>;

    /**
    * Flag for initialization component, used because ngOngChanges can be called before ngOnInit
    * which would cause component to be initialized twice (happened when component is inside a dialog)
    * Info: https://stackoverflow.com/questions/43111474/how-to-stop-ngonchanges-called-before-ngoninit/43111597
    */
    private initialized = false;

    private readonly debounceTime = 500;
    private searchControl = new FormControl();

    /**
     * Error message, if set it will be displayed by component
     */
    private errorMessage?: string;

    /**
     * Translations
     */
    private translations = {
        'delete': {
            'message': '',
            'cancel': '',
            'confirm': '',
            'title': '',
            'tooltip': '',
            'deleted': ''
        },
        'internalError': '',
        'all': ''
    };

    /**
     * Local storage helper
     */
    private localStorageHelper = new LocalStorageHelper();

    /** 
     * Filter
     */
    @ViewChild('filter') filter: ElementRef;

    /**
     * Paginator
     */
    @ViewChild('paginator') paginator: MatPaginator;

    constructor(
        private snackBar: MatSnackBar,
        private dialogService: TdDialogService,
        private translateService: TranslateService
    ) {
        super();

        // init translations once 
        this.initTranslations();
    }

    ngOnInit() {
        this.initDataTable(this.config);
    }

    ngOnChanges(changes: SimpleChanges) {
        this.initDataTable(this.config);
    }

    /**
     * inits data table
     */
    initDataTable(config: DataTableConfig): void {
        if (!this.config) {
            return;
        }

        // start up loader
        if (this.config.enableLocalLoader) {
            this.loaderEnabled = true;
        }

               // current state
               if (this.config.rememberState) {
                this.initLastState(this.config.getHash());
            }

        // map fields
        this.fieldsWrapper = this.config.fields.map(field => {
            return new DataTableFieldWrapper(field, guidHelper.newGuid());
        });

        // map buttons
        this.buttonsWrapper = new DataTableButtonWrapper(this.config.buttons, this.buttonsColumnDef);

        // delete button
        this.buttons = this.config.buttons;
        const deleteAction = this.config.deleteAction;
        if (deleteAction) {
            this.buttons.push(new DataTableButton(
                'delete',
                (item) => this.deleteConfirmation(deleteAction(item)),
                (item) => Observable.of(this.translations.delete.tooltip)
            ));
        }

        // init properties
        this.pageSize = this.config.pageSize;
        if (this.config.limit) {
            this.limit = this.config.limit;
        }
        this.currentPage = this.config.page;

        // init filters
        this.initFilters();

        // subscribe to text filter
        this.subscribeToTextFilterChanges();

        // subscribe to pager changes
        this.subscribeToPagerChanges();

        // load actual data
        this.reloadData();

        this.initialized = true;
    }

    private initFilters(): void {
        // add all filter
        const getData = this.config.getData;
        const allFilter = this.config.allFilter;
        let allFilterObs: Observable<void> | undefined;
        if (allFilter && this.config.filters && this.config.filters.length > 0 && getData) {
            allFilterObs = this.translateService.get('webComponents.dataTable.all').map(
                allText => {
                    // adjust all filter
                    this.tempFiltersWrapper.push(new FilterWrapper(
                        allText,
                        0,
                        allFilter,
                        1
                    ));
                }
            );
        }

        const observables: Observable<any>[] = [];

        this.config.filters.forEach(filter => {

            const obs = filter.count(this.search)
            .flatMap(response => {
                // create filter wrapper and set its count
                const filterWrapper = new FilterWrapper('', response.count, filter);
                return Observable.of(filterWrapper);
            })
            .flatMap(filterWrapper => {
                // resolve name and set it
                return filter.name.map(name => {
                    filterWrapper.resolvedName = name;

                    return filterWrapper;
                });
            })
            .map(filterWrapper => {
                // add filter to local variable
                this.tempFiltersWrapper.push(filterWrapper);
            });

            observables.push(obs);
        });

        // add all filter
        if (allFilterObs) {
            observables.push(allFilterObs);
        }

        observableHelper.zipObservables(observables)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(() => {
                // sort filters based on priority
                this.tempFiltersWrapper = this.tempFiltersWrapper.sort((n1, n2) => n1.priority - n2.priority);
                
                // replace filters with temp filters and reset temp filters
                this.filtersWrapper = this.tempFiltersWrapper;

                this.tempFiltersWrapper = [];
            });
    }

    private recalculateFilters(): void {
        this.filtersWrapper.forEach(filterWrapper => {
            filterWrapper.filter.count(this.search).map(response => {
                filterWrapper.resolvedCount = response.count;
            })
            .takeUntil(this.ngUnsubscribe)
            .subscribe();
        });
    }

    private runFilter(name: string): void {
        // find filter
        const filterWrapper = this.filtersWrapper.find(m => m.resolvedName === name);
        if (!filterWrapper) {
            console.warn(`Invalid filter'${name}'`);
            return;
        }

        // set current filter
        this.activeFilterName = name;

        // reload data
        this.loadData();
    }

    private subscribeToTextFilterChanges(): void {
        this.searchControl.valueChanges
            .debounceTime(this.debounceTime)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(searchTerm => {
                // udate searched variable
                this.search = searchTerm;

                // recalculate filters
                 this.recalculateFilters();

                // reload data
                this.reloadData();
            });
    }

    private subscribeToPagerChanges(): void {
        if (!this.paginator) {
            console.log('Could not init paginator');
            return;
        }

        // set translations
        this.paginator._intl.itemsPerPageLabel = '';

        this.paginator.page.map(pageChange => {
            this.currentPage = pageChange.pageIndex + 1;
            this.pageSize = pageChange.pageSize;

            this.reloadData();
        })
            .takeUntil(this.ngUnsubscribe)
            .subscribe();
    }

    private loadData(): void {
        if (this.config.enableLocalLoader) {
            this.loaderEnabled = true;
        }

        // reset errors
        this.resetErrors();

        // get Observable used to load data
        if (!this.config.getData) {
            throw new Error('Cannot fetch data because no get function was defined. This is a result of invalid configuration.');
        }

        let dataObs: Observable<DataTableResponse>;

        // get data from main observable if no filter is used
        let filter: Filter | undefined;
        if (this.activeFilterName) {
            const filterWrapper = this.filtersWrapper.find(m => m.resolvedName === this.activeFilterName);
            if (!filterWrapper) {
                console.log(`Invalid filter '${this.activeFilterName}'`);
            } else {
                filter = filterWrapper.filter;
            }
        }

        if (filter) {
            // use filter observable
            dataObs = filter.filter(this.currentPage, this.pageSize, this.search, this.limit);
        } else {
            // get data from filter if its set
            dataObs = this.config.getData(this.currentPage, this.pageSize, this.search, this.limit);
        }

        dataObs.map(response => {
            this.totalItems = response.totaltems;

            this.dataSource = new DataTableSource(response.items);

            // save current state
            if (this.config.rememberState) {
                this.saveCurrentState(this.config.getHash());
            }

            if (this.config.enableLocalLoader) {
                this.loaderEnabled = false;
            }
        })
            .takeUntil(this.ngUnsubscribe)
            .subscribe();
    }

    private deleteConfirmation(action: Observable<DataTableDeleteResponse>): void {
        this.dialogService.openConfirm({
            message: this.translations.delete.message,
            disableClose: false, // defaults to false
            title: this.translations.delete.title,
            cancelButton: this.translations.delete.cancel,
            acceptButton: this.translations.delete.confirm,
        }).afterClosed().subscribe((accept: boolean) => {
            if (accept) {
                this.deleteItem(action);
            } else {
                // user did not accepted delete
            }
        });
    }

    private deleteItem(action: Observable<DataTableDeleteResponse>): void {
        // reset error messages
        this.resetErrors();

        if (this.config.enableLocalLoader) {
            this.loaderEnabled = true;
        }

        action
            .takeUntil(this.ngUnsubscribe)
            .subscribe(response => {
                this.errorMessage = response.errorMessage;

                // reload data
                this.reloadData();

                if (this.config.enableLocalLoader) {
                    this.loaderEnabled = false;
                }

                this.showDeletedSnackbar();
            },
            err => {
                this.errorMessage = this.translations.internalError;

                if (this.config.enableLocalLoader) {
                    this.loaderEnabled = false;
                }
            });
    }

    private showSnackbar(message: string): void {
        this.snackBar.open(message, '', {
            duration: 2500
        });
    }

    private showDeletedSnackbar(): void {
        this.showSnackbar(this.translations.delete.deleted);
    }

    private resetErrors(): void {
        this.errorMessage = undefined;
    }

    private initTranslations(): void {
        this.translateService.get('webComponents.dataTable.delete.message').map(text => this.translations.delete.message = text)
            .zip(this.translateService.get('webComponents.dataTable.delete.title').map(text => this.translations.delete.title = text))
            .zip(this.translateService.get('webComponents.dataTable.delete.cancel').map(text => this.translations.delete.cancel = text))
            .zip(this.translateService.get('webComponents.dataTable.delete.confirm').map(text => this.translations.delete.confirm = text))
            .zip(this.translateService.get('webComponents.dataTable.delete.tooltip').map(text => this.translations.delete.tooltip = text))
            .zip(this.translateService.get('webComponents.dataTable.delete.deleted').map(text => this.translations.delete.deleted = text))
            .zip(this.translateService.get('webComponents.dataTable.internalError').map(text => this.translations.internalError = text))
            .takeUntil(this.ngUnsubscribe)
            .subscribe();
    }

    // local storage & last state
    private saveCurrentState(hash: number): void {
        this.localStorageHelper.saveFilterToLocalStorage(hash, this.activeFilterName || '');
        this.localStorageHelper.savePageToLocalStorage(hash, this.currentPage);
        this.localStorageHelper.saveSearchedDataToLocalStorage(hash, this.search);
    }

    private initLastState(hash: number): void {
        const filterFormStorage = this.localStorageHelper.getFilterFromLocalStorage(hash);
        const pageFromStorage = this.localStorageHelper.getPageFromLocalStorage(hash);
        const searchTermFromStorage = this.localStorageHelper.getSearchedDataFromLocalStorage(hash);

        if (filterFormStorage) {
            this.activeFilterName = filterFormStorage;
        }

        if (pageFromStorage) {
            this.currentPage = pageFromStorage;
        }

        if (searchTermFromStorage) {
            this.search = searchTermFromStorage;
        }
    }

    /**
     * Reloads data
     */
    reloadData(): void {
        this.loadData();
    }
}

class LocalStorageHelper {

    // local storage suffixes
    private localStorageActiveFilter = 'data_table_active_filter';
    private localStoragePage = 'data_table_page';
    private localStorageSearchedData = 'data_table_searchedData';

    getFilterFromLocalStorage(hash: number): string | null {
        return localStorage.getItem(this.localStorageActiveFilter + '_' + hash);
    }

    getPageFromLocalStorage(hash: number): number | null {
        const page = localStorage.getItem(this.localStoragePage + '_' + hash);

        if (!page) {
            // use first page if none is was set
            return 1;
        }

        return +page;
    }

    getSearchedDataFromLocalStorage(hash: number): string | null {
        return localStorage.getItem(this.localStorageSearchedData + '_' + hash);
    }

    saveFilterToLocalStorage(hash: number, filterGuid: string) {
        localStorage.setItem(this.localStorageActiveFilter + '_' + hash, filterGuid);
    }

    savePageToLocalStorage(hash: number, page: number) {
        localStorage.setItem(this.localStoragePage + '_' + hash, page.toString());
    }

    saveSearchedDataToLocalStorage(hash: number, search: string) {
        localStorage.setItem(this.localStorageSearchedData + '_' + hash, search);
    }
}



