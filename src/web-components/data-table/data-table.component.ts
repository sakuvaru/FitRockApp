import { DataSource } from '@angular/cdk/collections';
import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, MatSnackBar, MatSort, Sort } from '@angular/material';
import { TdDialogService } from '@covalent/core';
import { LocalizationService } from 'lib/localization';
import { Observable, Subject } from 'rxjs/Rx';
import * as _ from 'underscore';

import { guidHelper, observableHelper } from '../../lib/utilities';
import { BaseWebComponent } from '../base-web-component.class';
import { DataTableMode } from './data-table-mode.enum';
import {
    DataTableButton,
    DataTableButtonWrapper,
    DataTableDeleteResponse,
    DataTableFieldWrapper,
    DataTableResponse,
    DataTableSort,
    DynamicFilter,
    Filter,
    FilterWrapper,
} from './data-table-models';
import { DataTableSortEnum } from './data-table-sort.enum';
import { DataTableSource } from './data-table-source.class';
import { DataTableConfig } from './data-table.config';
import { IDataTableSort, IFilter } from './data-table.interfaces';

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
     * Loaded items
     */
    public items?: any[];

    /**
     * Indicates if loader is enabled
     */
    public loaderEnabled: boolean = false;

    /**
     * Identifier for buttons columns
     */
    public readonly buttonsColumnDef: string = '_buttons';

    /**
     * Guid of all filter
     */
    public readonly allFilterGuid: string = '_allFilter';

    /**
     * All filters
     */
    public filtersWrapper: FilterWrapper[] = [];

    /**
     * Number of filters shown on small layout
     */
    public readonly filtersOnSmallLayout: number = 2;

    /**
     * Forces all filters to be shown
     */
    public showFullFilters: boolean = false;

    /**
     * Snackbar duration
     */
    private readonly snackbarDuration: number = 2500;

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
     * Indicates if data table is clickable
     */
    get isClickable(): boolean {
        if (this.config.onClick) {
            return true;
        }
        return false;
    }

    /**
     * Indicates if any data was already loaded
     */
    public anyDataLoaded: boolean = false;

    /**
     * Temp variable to hold filters
     */
    private tempFiltersWrapper: FilterWrapper[] = [];

    /**
     * Guid of active filter
     */
    public activeFilterGuid?: string;

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

        // add button at the end (if there are any buttons)
        if (this.renderButtons) {
            fieldColumns.push(this.buttonsColumnDef);
        }

        return fieldColumns;
    }

    public get renderButtons(): boolean {
        if (this.buttonsWrapper && this.buttonsWrapper.buttons && this.buttonsWrapper.buttons.length > 0) {
            return true;
        }
        return false;
    }

    /**
     * Name definition for avatar column
     */
    public readonly avatarColumnDef: string = '_avatar';

    /**
     * Gets all data table buttons 
     */
    public buttons: DataTableButton<any>[] = [];

    /**
     * Limit
     */
    public limit?: number = undefined;

    /**
     * Page size
     */
    public pageSize: number = 20;

    /**
     * Total number of items in db in current state (including active filter for example)
     */
    public totalItems: number = 0;

    /**
     * Index of current page
     */
    public currentPage: number = 1;

    /**
     * Page size options
     */
    public pageSizeOptions: number[] = [];

    /**
     * Paginator indexes pages from 0
     */
    get paginatorPageIndex(): number {
        return this.currentPage - 1;
    }

    /**
     * Searched string
     */
    public search: string = '';

    /**
     * Fields wrapper
     */
    public fieldsWrapper: DataTableFieldWrapper[] = [];

    /**
     * Buttons wrapper
     */
    public buttonsWrapper?: DataTableButtonWrapper;

    /**
     * Data source
     */
    public dataSource?: DataSource<any>;

    /**
    * Flag for initialization component, used because ngOnChanges can be called before ngOnInit
    * which would cause component to be initialized twice (happened when component is inside a dialog)
    * Info: https://stackoverflow.com/questions/43111474/how-to-stop-ngonchanges-called-before-ngoninit/43111597
    */
    public initialized = false;

    private readonly debounceTime = 500;
    public searchControl = new FormControl();

    /**
     * Error message, if set it will be displayed by component
     */
    public errorMessage?: string;

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
     * Indicates if sort header has been subscribed to changes (sorting)
     */
    private sortHeaderSubscribed: boolean = false;

    /**
     * Indicates if paginator has been suscribed to changes
     */
    private paginatorSubscribed: boolean = false;

    /**
     * Indicates if tiles paginator has been suscribed to changes
     */
    private tilesPaginatorSubscribed: boolean = false;

    /**
     * Variable that holds current sort
     */
    private currentSort: IDataTableSort | undefined;

    /**
     * Indicates if table is using sorting.
     * This is calculated by checking if any of the fields contain
     * sort key. 
     */
    private get isSortable(): boolean {
        if (!this.config || !this.config.fields) {
            console.warn('Function is called before config or fields are available');
            return false;
        }

        const sortableField = this.config.fields.find(m => !(!m.sortKey));

        if (sortableField) {
            return true;
        }
        return false;
    }

    /** 
     * Filter
     */
    @ViewChild('filter') filter: ElementRef;

    /**
     * Paginator is registered this way because it is under *ngIf
     */
    private _paginator: MatPaginator;
    @ViewChild('paginator') set paginator(content: MatPaginator) {
        if (content && !this.paginatorSubscribed) {
            this._paginator = content;
            this.subscribeToPagerChanges();

            // unsubsribe from tiles paginator because switching back and forth between modes
            // would cause pager to not register changes
            this.unsubscribeFromTilesPaginator();
        }
    }

    /**
     * Paginator is registered this way because it is under *ngIf
     */
    private _tilesPaginator: MatPaginator;
    @ViewChild('tilesPaginator') set tilesPaginator(content: MatPaginator) {
        if (content && !this.tilesPaginatorSubscribed) {
            this._tilesPaginator = content;
            this.subscribeToTilesPagerChanges();

            // unsubsribe from tiles paginator because switching back and forth between modes
            // would cause pager to not register changes
            this.unsubscribeFromPaginator();
        }
    }

    /**
     * Sort header
     */
    private _matSort: MatSort;
    @ViewChild(MatSort) set matSort(content: MatSort) {
        this._matSort = content;

        // subscribe to changes once sort is available 
        // this is here because the element is under *ngIf and therefore cannot be initilized immediately
        if (content && !this.sortHeaderSubscribed && this.isSortable) {
            this.subscribeToSortChanges();
        }
    }

    constructor(
        private snackBar: MatSnackBar,
        private dialogService: TdDialogService,
        private localizationService: LocalizationService
    ) {
        super();

        // init translations once 
        this.initTranslations();
    }

    ngOnInit() {
        this.initDataTable();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.initDataTable();
    }

    reloadData(recalculateFilters: boolean = true): void {
        this.reloadDataSubject.next(recalculateFilters);
    }

    handleOnClick(item: any): void {
        if (this.config.onClick) {
            this.config.onClick(item);
        }
    }

    handleButtonClick(event: any, button: DataTableButton<any>, item: any): void {
        // cancel propagation of clicks so that e.g. 'onClick' event for the entire row
        // is not triggered
        event.stopPropagation();

        // trigger action
        button.action(item);
    }

    getPreviewItemName(item: any): Observable<string> {
        const getFirstFieldValue = (dataItem: any) => {
            if (!dataItem) {
                throw Error(`Cannot get first column because item is undefined`);
            }

            if (!this.config.fields[0]) {
                throw Error(`First field is undefined`);
            }

            const value = this.config.fields[0].value(item);

            if (value instanceof Observable) {
                return value;
            }

            return Observable.of(value);
        };

        // try getting the objet preview name using given function
        if (this.config.itemName) {
            return Observable.of(this.config.itemName(item));
        }

        // get first field value
        return getFirstFieldValue(item);
    }

    toggleMode(): void {
        if (this.config.mode === DataTableMode.Standard) {
            this.config.mode = DataTableMode.Tiles;
        } else {
            this.config.mode = DataTableMode.Standard;
        }
    }

    toggleShowFullFilters(): void {
        this.showFullFilters = !this.showFullFilters;
    }

    runFilter(guid: string): void {
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

    /**
     * inits data table
     */
    private initDataTable(): void {
        if (!this.config || this.initialized) {
            return;
        }

        // mark component as initialized to prevent multiple initialization
        this.initialized = true;

        // start up loader
        if (this.config.enableLocalLoader) {
            this.loaderEnabled = true;
        }

        // current state
        if (this.config.rememberState) {
            this.initLastState(this.config.getHash());
        }

        // map fields
        if (!this.config.fields) {
            throw Error(`No fields were defined. Configure 'fields' property of the DataTableConfig class.`);
        }

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
        this.pageSizeOptions = this.config.pageSizeOptions;

        // subscribe to text filter
        this.subscribeToTextFilterChanges();

        // subscribe to reload data observable
        this.subscribeToReloadData();

        // if filters are used, init them and them load data 
        // (so that current filter can be used to load filtered data)
        if (this.areFiltersUsed()) {
            this.getInitFiltersObservable()
                .takeUntil(this.ngUnsubscribe)
                .subscribe(filtersResolved => {
                    // at this point all filters should be initialized
                    this.reloadData(false);
                },
                error => this.handleError(error));
        } else {
            // no filters are used
            this.reloadData();
        }
    }

    private areFiltersUsed(): boolean {
        if ((!this.config.filters || this.config.filters.length === 0) && !this.config.dynamicFilters) {
            // no filters are configured
            return false;
        }

        return true;
    }

    private useStaticFilters(): boolean {
        if (this.config.filters && this.config.filters.length > 0) {
            return true;
        }
        return false;
    }

    private userDynamicFilters(): boolean {
        if (this.config.dynamicFilters) {
            return true;
        }
        return false;
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

        if (this.useStaticFilters()) {
            // static filters are used
            return this.initStaticFilters();
        }

        if (this.userDynamicFilters()) {
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

                return Observable.of(true);
            });
    }

    private initStaticFilters(): Observable<boolean> {
        const filters = this.config.filters;

        const observables: Observable<any>[] = [];

        // prepare observable for getting all filter
        if (this.config.allFilter && filters && filters.length) {
            const allFilter = new Filter(
                this.allFilterGuid,
                this.config.allFilter.name ? this.config.allFilter.name : this.localizationService.get('webComponents.dataTable.all'),
                this.config.allFilter.filter,
                this.config.allFilter.count,
                0
            );

            observables.push(
                allFilter.count(this.search)
                .flatMap(response => {
                    // create filter wrapper and set its count
                    const filterWrapper = new FilterWrapper('', response.count, allFilter);

                    return Observable.of(filterWrapper);
                })
                .flatMap(filterWrapper => {
                    // resolve name and set it
                    return allFilter.name.map(name => {
                        filterWrapper.resolvedName = name;
                        return filterWrapper;
                    });
                })
                .map(filterWrapper => {
                    // add filter to local variable
                    this.tempFiltersWrapper.push(filterWrapper);
                })
            );
        }

        filters.forEach(filter => {
            let filterObs;

            if (filter instanceof Filter) {
                filterObs = filter.count(this.search);
            } else {
                throw Error(`Static filter is required for evaluating static filters`);
            }

            filterObs = filterObs
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

                return Observable.of(true);
            });
    }

    private activateTempFilters(): void {
        if (this.useStaticFilters()) {
            this.filtersWrapper = this.tempFiltersWrapper.filter(m => m.resolvedCount > 0);
            this.tempFiltersWrapper = [];
            return;
        }

        if (this.userDynamicFilters()) {
            this.filtersWrapper = this.tempFiltersWrapper.filter(m => m.resolvedCount > 0);
            this.tempFiltersWrapper = [];
            return;
        }
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

        // logic is the same for initialization, so use that
        return this.initStaticFilters().map(r => undefined);

        /*
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
        */

        // return observableHelper.zipObservables(observables);
    }

    private recalculateDynamicFilters(): Observable<void> {
        if (!this.config.dynamicFilters) {
            throw Error('Cannot recalculate dynamic filters');
        }

        // logic is the same for initialization, so use that
        return this.initDynamicFilters().map(r => undefined);
    }

    private subscribeToTextFilterChanges(): void {
        this.searchControl.valueChanges
            .debounceTime(this.debounceTime)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(searchTerm => {
                // update searched variable
                this.search = searchTerm;

                // reload data
                this.reloadData();
            },
            error => this.handleError(error));
    }

    private unsubscribeFromPaginator(): void {
        if (this._paginator) {
            this._paginator.page.unsubscribe();

            this.paginatorSubscribed = false;
        }
    }

    private unsubscribeFromTilesPaginator(): void {
        if (this._tilesPaginator) {
            this._tilesPaginator.page.unsubscribe();

            this.tilesPaginatorSubscribed = false;
        }
    }

    private subscribeToSortChanges(): void {
        this._matSort.sortChange
            .debounceTime(this.debounceTime) // this also prevents the arrow animation from breaking
            .takeUntil(this.ngUnsubscribe)
            .subscribe(sort => {
                // update current sort
                this.setCurrentSort(sort);

                // reload data
                this.reloadData();
            });

        this.sortHeaderSubscribed = true;
    }

    private subscribeToPagerChanges(): void {
        if (!this._paginator) {
            throw Error('Could not init paginator. Make sure the paginator is registered after its been initialized in template');
        }

        // mark paginator as subscribed so that there are no multiple subscriptions
        this.paginatorSubscribed = true;

        // set translations
        this._paginator._intl.itemsPerPageLabel = '';

        this._paginator.page.map(pageChange => {
            this.currentPage = pageChange.pageIndex + 1;
            this.pageSize = pageChange.pageSize;
            this.reloadData();
        })
            .takeUntil(this.ngUnsubscribe)
            .subscribe();
    }

    private subscribeToTilesPagerChanges(): void {
        if (!this._tilesPaginator) {
            throw Error('Could not init paginator. Make sure the paginator is registered after its been initialized in template');
        }

        // mark paginator as subscribed so that there are no multiple subscriptions
        this.tilesPaginatorSubscribed = true;

        // set translations
        this._tilesPaginator._intl.itemsPerPageLabel = '';

        this._tilesPaginator.page.map(pageChange => {
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
            throw new Error('Cannot load data because no get function was defined. This is a result of invalid configuration.');
        }

        let dataObs: Observable<DataTableResponse>;

        // try getting active filter
        let activeFilter: IFilter | undefined;
        if (this.activeFilterGuid) {
            const activeFilterWrapper = this.tempFiltersWrapper.find(m => m.filter.guid === this.activeFilterGuid);
            if (!activeFilterWrapper) {
                // filter might not be available because it has been removed due to searched term (dynamic filters)
            } else {
                activeFilter = activeFilterWrapper.filter;
            }
        } else {
            // use the 'first' active filter is none is set & filters are used
            if (this.tempFiltersWrapper.length > 0) {
                activeFilter = this.tempFiltersWrapper[0].filter;
                this.activeFilterGuid = activeFilter.guid;
            }
        }

        // filter || default load function
        if (activeFilter) {
            // use filter observable
            dataObs = activeFilter.filter(this.currentPage, this.pageSize, this.search, this.limit, this.currentSort);
        } else {
            // get data from filter if its set
            dataObs = this.config.getData(this.currentPage, this.pageSize, this.search, this.limit, this.currentSort);
        }

        return dataObs
            .map(response => {
                this.totalItems = response.totaltems;

                this.dataSource = new DataTableSource(response.items);

                // set items
                this.items = response.items;

                // set filters
                // this is used here beacuse we want both items & filters to appear at the same time
                this.activateTempFilters();

                // save current state
                if (this.config.rememberState) {
                    this.saveCurrentState(this.config.getHash());
                }

                // mark data as loaded
                this.anyDataLoaded = true;
            });
    }

    private setCurrentSort(sort: Sort): void {
        if (!sort) {
            return;
        }

        // if direction is empty, it means that the default state is active
        if (!sort.direction) {
            // remove sort 
            this.currentSort = undefined;
            return;
        }

        // get sort order
        const sortOrder = sort.direction.toLocaleLowerCase() === 'asc' ? DataTableSortEnum.Asc : DataTableSortEnum.Desc;

        // get sorted field
        const sortedFieldWrapper = this.fieldsWrapper.find(m => m.nameDef === sort.active);

        if (!sortedFieldWrapper) {
            throw Error(`Cannot sort table due to invalid '${sort.active}' sort field`);
        }

        this.currentSort = new DataTableSort(sortOrder, sortedFieldWrapper.field);
    }

    private deleteConfirmation(action: Observable<DataTableDeleteResponse>, item: any): void {
        this.getPreviewItemName(item)
            .flatMap(previewName => {
                return this.localizationService
                    .get('webComponents.dataTable.delete.messageWithName', { 'name': previewName })
                    .map(message => {
                        this.dialogService.openConfirm({
                            message: message,
                            disableClose: false, // defaults to false
                            title: this.translations.delete.title,
                            cancelButton: this.translations.delete.cancel,
                            acceptButton: this.translations.delete.confirm,
                        }).afterClosed()
                            .takeUntil(this.ngUnsubscribe)
                            .subscribe((accept: boolean) => {
                                if (accept) {
                                    this.deleteItem(action);
                                } else {
                                    // user did not accepted delete
                                }
                            });
                    });
            })
            .takeUntil(this.ngUnsubscribe)
            .subscribe();
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
            duration: this.snackbarDuration
        });
    }

    private showDeletedSnackbar(): void {
        this.showSnackbar(this.translations.delete.deleted);
    }

    private resetErrors(): void {
        this.errorMessage = undefined;
    }

    private initTranslations(): void {
        this.localizationService.get('webComponents.dataTable.delete.messageGeneric').map(text => this.translations.delete.messageGeneric = text)
            .zip(this.localizationService.get('webComponents.dataTable.all').map(text => this.translations.all = text))
            .zip(this.localizationService.get('webComponents.dataTable.delete.title').map(text => this.translations.delete.title = text))
            .zip(this.localizationService.get('webComponents.dataTable.delete.cancel').map(text => this.translations.delete.cancel = text))
            .zip(this.localizationService.get('webComponents.dataTable.delete.confirm').map(text => this.translations.delete.confirm = text))
            .zip(this.localizationService.get('webComponents.dataTable.delete.tooltip').map(text => this.translations.delete.tooltip = text))
            .zip(this.localizationService.get('webComponents.dataTable.delete.deleted').map(text => this.translations.delete.deleted = text))
            .zip(this.localizationService.get('webComponents.dataTable.internalError').map(text => this.translations.internalError = text))
            .zip(this.localizationService.get('webComponents.dataTable.loadingDataError').map(text => this.translations.loadingDataError = text))
            .takeUntil(this.ngUnsubscribe)
            .subscribe();
    }

    private handleError(error: any): void {
        console.warn('Error loading data table: ');
        console.error(error);

        this.errorMessage = this.translations.loadingDataError;

        this.loaderEnabled = false;

        // resubscribe to load subject
        this.subscribeToReloadData();
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
            /*
            The order of recalcualte filters & load data observable is important. The filters need to be recalculated
            before items are loaded because otherwise it would cause an issue when dynamic filter is enabled and searched is performed.
            The search would use 'old' value and therefore filters would show correct counts, but actual data table would contain data
            using previous search
            */
            // Execute before data
            .switchMap(recalculateFilters => {
                return recalculateFilters ? this.recalculateFilters() : Observable.of(undefined);
            })
            // execute after filters are recalculated
            .switchMap(() => this.getLoadDataObservable())
            .takeUntil(this.ngUnsubscribe)
            .subscribe(() => {

                if (this.config.enableLocalLoader) {
                    this.loaderEnabled = false;
                }

            }, error => this.handleError(error));
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




