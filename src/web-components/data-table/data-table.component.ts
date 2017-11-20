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
    DataTableCountResponse, DynamicFilter, AllFilter
} from './data-table-models';
import { IFilter } from './data-table.interfaces';
import { MatPaginator } from '@angular/material';
import { Observable, Subject } from 'rxjs/Rx';
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
     * This gets triggered whenever any state of table changes such as
     * when page is changed, filter is used, filter is changed, searched etc..
     * Loaders should switch map based on this subject
     */
    private reloadDataSubject = new Subject<boolean>();

    /**
     * Indicates if loader is enabled
     */
    private loaderEnabled: boolean = false;

    /**
     * Identifier for buttons columns
     */
    private readonly buttonsColumnDef: string = '_buttons';

    /**
     * Guid of all filter
     */
    private readonly allFilterGuid: string = '_allFilter';

    /**
     * All filters
     */
    private filtersWrapper: FilterWrapper[] = [];

    /**
     * Number of filters shown on small layout
     */
    private readonly filtersOnSmallLayout: number = 3;

    /**
     * Forces all filters to be shown
     */
    private showFullFilters: boolean = false;

    /**
     * All filters for small layout
     */
    get filtersWrapperSmallLayout(): FilterWrapper[] {
        if (!this.filtersWrapper) {
            return [];
        }

        return _.first(this.filtersWrapper, this.filtersOnSmallLayout);
    }

    /**
     * Temp variable to hold filters
     */
    private tempFiltersWrapper: FilterWrapper[] = [];

    /**
     * Guid of active filter
     */
    private activeFilterGuid?: string;

    /**
     * Displayed columns
     */
    get displayedColumns(): string[] {
        let fieldColumns: string[] = [];

        // add avatar at the beginning
        if (this.showAvatar) {
            fieldColumns.push(this.avatarColumnDef);
        }
        
        // add fields
        fieldColumns = _.union(fieldColumns, this.fieldsWrapper.map(m => m.nameDef));

        // add button at the end
        if (this.buttonsWrapper || this.config.deleteAction) {
            fieldColumns.push(this.buttonsColumnDef);
        }

        return fieldColumns;
    }

    /**
     * Name definition for avatar column
     */
    private readonly avatarColumnDef: string = '_avatar';

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
     * Total number of items in db in current state (including active filter for example)
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
            'messageGeneric': '',
            'cancel': '',
            'confirm': '',
            'title': '',
            'tooltip': '',
            'deleted': ''
        },
        'internalError': '',
        'all': '',
        'loadingDataError': ''
    };

    /**
     * Local storage helper
     */
    private localStorageHelper = new LocalStorageHelper();

    get showAvatar(): boolean {
        if (this.config.avatar) {
            return true;
        }
        return false;
    }

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
                (item) => this.deleteConfirmation(deleteAction(item), item),
                (item) => Observable.of(this.translations.delete.tooltip)
            ));
        }

        // init properties
        this.pageSize = this.config.pageSize;
        if (this.config.limit) {
            this.limit = this.config.limit;
        }
        this.currentPage = this.config.page;

        // subscribe to text filter
        this.subscribeToTextFilterChanges();

        // subscribe to pager changes
        this.subscribeToPagerChanges();

        // subscribe to reload data observable
        this.subscribeToReloadData();

        // if filters are used, init them and them load data 
        // (so that current filter can be used to load filtered data)
        if (this.areFiltersUsed()) {
            this.getInitFiltersObservable()
                .takeUntil(this.ngUnsubscribe)
                .subscribe(filtersResolved => {
                    // at this point all filters should be initialized
                    this.reloadData();
                },
                error => this.handleError(error));
        } else {
            // no filter is used
            // load data and filters independently
            this.getInitFiltersObservable()
                .takeUntil(this.ngUnsubscribe)
                .subscribe(undefined, error => this.handleError(error));

            // load data without filter
            this.reloadData();
        }

        this.initialized = true;
    }

    private areFiltersUsed(): boolean {
        if ((!this.config.filters || this.config.filters.length === 0) && !this.config.dynamicFilters) {
            // no filters are configured
            return false;
        }

        return true;
    }

    private getInitFiltersObservable(): Observable<boolean> {
        if ((!this.config.filters || this.config.filters.length === 0) && !this.config.dynamicFilters) {
            // no filters are configured
            return Observable.of(false);
        }

        if (this.config.filters && this.config.filters.length > 0 && this.config.dynamicFilters) {
            console.warn('Cannot evaluate both dynamic & static filters for Data table. Remove either one or the other');
            return Observable.of(false);
        }

        if (this.config.filters && this.config.filters.length > 0) {
            // static filters are used
            return this.initStaticFilters();
        }

        if (this.config.dynamicFilters) {
            // dynamic filters
            return this.initDynamicFilters();
        }

        return Observable.of(false);
    }

    private initDynamicFilters(): Observable<boolean> {
        if (!this.config.dynamicFilters) {
            console.warn('Cannot init dynamic filters');
            return Observable.of(false);
        }

        const getData = this.config.getData;

        if (!getData) {
            console.warn('Cannot init dynamic filters due to invalid dat function');
            return Observable.of(false);
        }

        return this.config.dynamicFilters(this.search)
            .flatMap(dynamicFilters => {
                const filtersObs: Observable<any>[] = [];

                dynamicFilters.forEach(dynamicFilter => {
                    filtersObs.push(
                        dynamicFilter.name
                            .map(resolvedName => {
                                return new FilterWrapper(
                                    resolvedName,
                                    dynamicFilter.count,
                                    dynamicFilter
                                );
                            })
                            .map(filter => {
                                this.tempFiltersWrapper.push(filter);
                            }));
                });

                // automatically append all filter at the beginning
                // this filter is added when dynamic filters are used
                filtersObs.push(Observable.of(
                    new FilterWrapper(
                        this.translations.all,
                        0,
                        new DynamicFilter(
                            this.allFilterGuid,
                            Observable.of(''),
                            getData,
                            1,
                            0
                        )
                    )
                )
                    .map(filter => {
                        this.tempFiltersWrapper.push(filter);
                    }));

                return observableHelper.zipObservables(filtersObs);
            })
            .flatMap(() => {
                // sort filters based on priority
                this.tempFiltersWrapper = this.tempFiltersWrapper.sort((n1, n2) => n1.filter.priority - n2.filter.priority);

                // calculate total number of items and set all filter which should be added automatically
                const allFilter = this.tempFiltersWrapper.find(m => m.filter.guid === this.allFilterGuid);
                if (!allFilter) {
                    console.warn('Could not find all filter for data table');
                } else {
                    let totalCount = 0;
                    this.tempFiltersWrapper.forEach(tempFilter => {
                        totalCount = totalCount + tempFilter.resolvedCount;
                    });

                    allFilter.resolvedCount = totalCount;
                }

                // replace filters with temp filters and reset temp filters
                this.filtersWrapper = this.tempFiltersWrapper;

                this.tempFiltersWrapper = [];

                return Observable.of(true);
            });
    }

    private initStaticFilters(): Observable<boolean> {
        const filters = this.config.filters;

        // prepare all filter
        const allFilter = this.config.allFilter;
        if (allFilter && this.config.filters && this.config.filters.length > 0) {
            // change the text for all filter
            filters.push(new Filter(
                this.allFilterGuid,
                this.translateService.get('webComponents.dataTable.all'),
                allFilter.filter,
                allFilter.count,
                0
            ));
        }

        const observables: Observable<any>[] = [];

        filters.forEach(filter => {

            let filterObs;

            if (filter instanceof Filter) {
                filterObs = filter.count(this.search);
            } else {
                throw Error(`Static filter is required for evaluating static filters`);
            }

            filterObs
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

            observables.push(filterObs);
        });

        return observableHelper.zipObservables(observables)
            .flatMap(() => {
                // sort filters based on priority
                this.tempFiltersWrapper = this.tempFiltersWrapper.sort((n1, n2) => n1.filter.priority - n2.filter.priority);

                // replace filters with temp filters and reset temp filters
                this.filtersWrapper = this.tempFiltersWrapper;

                this.tempFiltersWrapper = [];

                return Observable.of(true);
            });
    }

    private recalculateFilters(): Observable<void> {
        if ((!this.config.filters || this.config.filters.length === 0) && !this.config.dynamicFilters) {
            // no filters are configured
            return Observable.of(undefined);
        }

        if (this.config.filters && this.config.filters.length > 0) {
            return this.recalculateStaticFilters();
        }

        if (this.config.dynamicFilters) {
            return this.recalculateDynamicFilters();
        }

        return Observable.of(undefined);
    }

    private recalculateStaticFilters(): Observable<void> {

        const observables: Observable<void>[] = [];

        this.filtersWrapper.forEach(filterWrapper => {
            if (filterWrapper.filter instanceof Filter) {
                observables.push(
                    filterWrapper.filter.count(this.search).map(response => {
                        filterWrapper.resolvedCount = response.count;
                    }));
            } else {
                throw Error(`Cannot recalculate static filters because invalid filter type was provided`);
            }

        });

        return observableHelper.zipObservables(observables);
    }

    private recalculateDynamicFilters(): Observable<void> {
        if (!this.config.dynamicFilters) {
            throw Error('Cannot recalculate dynamic filters');
        }

        // logic is the same for initialization, so use that
        return this.initDynamicFilters().map(r => undefined);
    }

    private runFilter(guid: string): void {
        // find filter
        const filterWrapper = this.filtersWrapper.find(m => m.filter.guid === guid);
        if (!filterWrapper) {
            throw Error(`Invalid filter '${guid}'`);
        }

        // reset page to 1
        this.currentPage = 1;

        // set current filter
        this.activeFilterGuid = guid;

        // reload data
        this.reloadData();
    }

    private subscribeToTextFilterChanges(): void {
        this.searchControl.valueChanges
            .debounceTime(this.debounceTime)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(searchTerm => {
                // udate searched variable
                this.search = searchTerm;

                // reload data
                this.reloadData();
            },
            error => this.handleError(error));
    }

    private subscribeToPagerChanges(): void {
        if (!this.paginator) {
            console.warn('Could not init paginator');
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

    private getLoadDataObservable(): Observable<void> {
        // get Observable used to load data
        if (!this.config.getData) {
            throw new Error('Cannot fetch data because no get function was defined. This is a result of invalid configuration.');
        }

        let dataObs: Observable<DataTableResponse>;

        // try getting active filter
        let activeFilter: IFilter | undefined;
        if (this.activeFilterGuid) {
            const activeFilterWrapper = this.filtersWrapper.find(m => m.filter.guid === this.activeFilterGuid);
            if (!activeFilterWrapper) {
                console.warn(`Invalid filter '${this.activeFilterGuid}'`);
            } else {
                activeFilter = activeFilterWrapper.filter;
            }
        }

        if (activeFilter) {
            // use filter observable
            dataObs = activeFilter.filter(this.currentPage, this.pageSize, this.search, this.limit);
        } else {
            // get data from filter if its set
            dataObs = this.config.getData(this.currentPage, this.pageSize, this.search, this.limit);
        }

        return dataObs
            .map(response => {
                this.totalItems = response.totaltems;

                this.dataSource = new DataTableSource(response.items);

                // save current state
                if (this.config.rememberState) {
                    this.saveCurrentState(this.config.getHash());
                }

                if (this.config.enableLocalLoader) {
                    this.loaderEnabled = false;
                }
            });
    }

    private deleteConfirmation(action: Observable<DataTableDeleteResponse>, item: any): void {
        // try getting the objet preview name
        const previewName = this.config.itemName ? this.config.itemName(item) : undefined;

        if (previewName) {
            this.translateService
                .get('webComponents.dataTable.delete.messageWithName', { 'name': previewName })
                .map(message => {
                    this.dialogService.openConfirm({
                        message: message,
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
                })
                .takeUntil(this.ngUnsubscribe)
                .subscribe();

        } else {
            this.dialogService.openConfirm({
                message: this.translations.delete.messageGeneric,
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
        this.translateService.get('webComponents.dataTable.delete.messageGeneric').map(text => this.translations.delete.messageGeneric = text)
            .zip(this.translateService.get('webComponents.dataTable.all').map(text => this.translations.all = text))
            .zip(this.translateService.get('webComponents.dataTable.delete.title').map(text => this.translations.delete.title = text))
            .zip(this.translateService.get('webComponents.dataTable.delete.cancel').map(text => this.translations.delete.cancel = text))
            .zip(this.translateService.get('webComponents.dataTable.delete.confirm').map(text => this.translations.delete.confirm = text))
            .zip(this.translateService.get('webComponents.dataTable.delete.tooltip').map(text => this.translations.delete.tooltip = text))
            .zip(this.translateService.get('webComponents.dataTable.delete.deleted').map(text => this.translations.delete.deleted = text))
            .zip(this.translateService.get('webComponents.dataTable.internalError').map(text => this.translations.internalError = text))
            .zip(this.translateService.get('webComponents.dataTable.loadingDataError').map(text => this.translations.loadingDataError = text))
            .takeUntil(this.ngUnsubscribe)
            .subscribe();
    }

    private handleError(error: any): void {
        console.warn('Error loading data table: ');
        console.error(error);

        this.errorMessage = this.translations.loadingDataError;

        this.loaderEnabled = false;
    }

    // local storage & last state
    private saveCurrentState(hash: number): void {
        this.localStorageHelper.saveFilterToLocalStorage(hash, this.activeFilterGuid || '');
        this.localStorageHelper.savePageToLocalStorage(hash, this.currentPage);
        this.localStorageHelper.saveSearchedDataToLocalStorage(hash, this.search);
    }

    private initLastState(hash: number): void {
        const filterFormStorage = this.localStorageHelper.getFilterFromLocalStorage(hash);
        const pageFromStorage = this.localStorageHelper.getPageFromLocalStorage(hash);
        const searchTermFromStorage = this.localStorageHelper.getSearchedDataFromLocalStorage(hash);

        if (filterFormStorage) {
            this.activeFilterGuid = filterFormStorage;
        }

        if (pageFromStorage) {
            this.currentPage = pageFromStorage;
        }

        if (searchTermFromStorage) {
            this.search = searchTermFromStorage;
        }
    }

    private reloadData(): void {
        this.reloadDataSubject.next(true);
    }

    /**
     * Subscribes to reload items observable
     */
    private subscribeToReloadData(): void {
        this.reloadDataSubject
            .do(() => {
                if (this.config.enableLocalLoader) {
                    this.loaderEnabled = true;
                }

                // reset errors
                this.resetErrors();
            })
            .switchMap(bool => this.recalculateFilters().zip(this.getLoadDataObservable())) // zip on this level becase we want to execute both at the same time
            .takeUntil(this.ngUnsubscribe)
            .subscribe(() => {

                if (this.config.enableLocalLoader) {
                    this.loaderEnabled = false;
                }

            }, error => this.handleError(error));
    }

    private toggleShowFullFilters(): void {
        this.showFullFilters = !this.showFullFilters;
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



