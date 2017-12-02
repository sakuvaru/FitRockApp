// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentSetup } from '../../core';

// required by component
import { Log, User, Exercise } from '../../models';
import { CurrentUser } from '../../../lib/auth';
import { Observable } from 'rxjs/Rx';
import { DataTableConfig, IDynamicFilter } from '../../../web-components/data-table/';
import { DataFormBuilder, DataFormConfig, DataFormFieldChangeResult, DataFormSectionSize } from '../../../web-components/data-form/';

@Component({
    templateUrl: 'dashboard.component.html'
})
export class DashboardComponent extends BaseComponent implements OnInit {

    public logs: Log[];
    public log: Log;
    public currentUser: CurrentUser | null;

    public config: DataTableConfig;
    public formConfig: DataFormConfig;

    constructor(
        protected dependencies: ComponentDependencyService) {
        super(dependencies);
    }

    setup(): ComponentSetup | null {
        return {
            initialized: false
        };
    }

    ngOnInit(): void {
        super.ngOnInit();

        this.formConfig = this.dependencies.itemServices.exerciseService.buildInsertForm()
            .section({
                rowNumber: 3,
                title: Observable.of('Additional items'),
                size: DataFormSectionSize.Medium
            })
            // .fieldLabelResolver((fieldname, originalLabel) => Observable.of('he'))
            .fieldValueResolver((fieldName, value) => {
                if (fieldName === 'ExerciseName') {
                    return Observable.of('Hello smurfies');
                }
                return Observable.of(value);
            })
            .onFieldValueChange((fields, field, value) => {
                return Observable.of(undefined)
                    .map(() => {
                        // fields[0].label = 'Asef';
                        // console.log(fields);
                    });
            })
            .build();

        /*
        this.formConfig = this.dependencies.webComponentServices.dataFormService.insertForm<Exercise>(
            'Exercise',
            this.dependencies.itemServices.exerciseService.insertFormQuery().get(),
            (formData) => this.dependencies.itemServices.exerciseService.create(formData).set(),
            {
                delete: (formData) => this.dependencies.itemServices.exerciseService.delete(formData['Id']).set()
            }
        )
            .section({
                rowNumber: 3,
                title: Observable.of('Additional items'),
                size: DataFormSectionSize.Medium
            })
            // .fieldLabelResolver((fieldname, originalLabel) => Observable.of('he'))
            .fieldValueResolver((fieldName, value) => {
                if (fieldName === 'ExerciseName') {
                    return Observable.of('Hello smurfies');
                }
                return Observable.of(value);
            })
            .onFieldValueChange((fields, field, value) => {
                return Observable.of(undefined)
                    .map(() => {
                        // fields[0].label = 'Asef';
                        // console.log(fields);
                    });
            })
            .build();
            */

        /*
        this.config = this.dependencies.webComponentServices.dataTableService.dataTable<Exercise>(
            (search) => this.dependencies.itemServices.exerciseService.items()
                .include('ExerciseCategory')
                .whereLike('ExerciseName', search)
        )
            .withFields([
                { sortKey: 'ExerciseName', name: item => 'Name', value: item => item.exerciseName, hideOnSmallScreen: false },
                { sortKey: 'ExerciseCategory.CategoryName', name: item => 'Category', value: item => item.exerciseCategory.categoryName, hideOnSmallScreen: true },
            ])
            .withButton(
            {
                icon: 'motorcycle',
                action: (item => {
                    console.log('Action was triggered');
                }),
                tooltip: (item) => super.translate('shared.search')
            }
            )
            .withDynamicFilters(
                search => 
                    this.dependencies.itemServices.exerciseCategoyService.getCategoriesWithExercisesCount(search, true)
                      .get()
                      .map(response => {
                        const filters: IDynamicFilter<Exercise>[] = [];
                        response.items.forEach(category => {
                          filters.push(({
                            guid: category.id.toString(),
                            name: Observable.of(category.codename),
                            query: (query) => {
                                return query.whereEquals('ExerciseCategoryId', category.id);
                            },
                            count: category.exercisesCount
                          }));
                        });
                        return filters;
                    })
            )
            .onClick(item => console.log('click:' + item.codename))
            .avatarIcon(item => 'language')
            .deleteAction((item) => this.dependencies.itemServices.exerciseService.delete(item.id), item => item.exerciseName)
            .build();

        */

        /*
        this.config = this.dependencies.webComponentServices.dataTableService.dataTable<User>(
            (search) => this.dependencies.itemServices.userService.items()
                .whereLikeMultiple(['FirstName', 'LastName'], search)
        )
            .withFields([
                { name: item => 'Name', value: item => {
                    return item.getFullName();
                } },
                { name: item => 'E-mail', value: item => item.email },
                { name: item => super.translate('type.user'), value: item => item.city }
            ])
            .withButton(
                {
                    icon: 'motorcycle',
                    action: (item => {
                        console.log('Action was triggered');
                    }),
                    tooltip: (item) => super.translate('shared.search')
                }
            )
            .withFilters([
                {
                    name: Observable.of('Ivuska'),
                    query: (query) => query.whereLike('FirstName', 'Ivuska'),
                },
                {
                    name: Observable.of('Janet'),
                    query: (query) => query.whereLike('FirstName', 'Janet')
                },
                {
                    name: Observable.of('Barry'),
                    query: (query) => query.whereLike('FirstName', 'Barry')
                }
            ])
            .allFilter(Observable.of('all'))
            .deleteAction((item) => this.dependencies.itemServices.userService.delete(item.id))
            .build();
            */

        this.setConfig({
            menuTitle: { key: 'menu.main' },
            componentTitle: { key: 'menu.dashboard' }
        });

        this.dependencies.itemServices.userService.item().byId(1).get().subscribe(response => console.log(response));

        super.subscribeToObservable(this.dependencies.itemServices.logService.items().limit(5).orderByDesc('id').get()
            .takeUntil(this.ngUnsubscribe)
            .map(
            response => {
                console.log(response);
                this.logs = response.items;
            }));

        this.currentUser = this.dependencies.coreServices.authService.getCurrentUser();
    }

    onLogout(): void {
        this.dependencies.coreServices.authService.logout();
    }
}
