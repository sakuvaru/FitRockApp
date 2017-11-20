// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentSetup } from '../../core';

// required by component
import { Log, User, Exercise } from '../../models';
import { CurrentUser } from '../../../lib/auth';
import { Observable } from 'rxjs/Rx';

import { DataTableConfig, IDynamicFilter } from '../../../web-components/data-table/data-table.builder';

@Component({
    templateUrl: 'dashboard.component.html'
})
export class DashboardComponent extends BaseComponent implements OnInit {

    private logs: Log[];
    private log: Log;
    private currentUser: CurrentUser | null;

    private config: DataTableConfig;

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

        this.config = this.dependencies.webComponentServices.dataTableService.dataTable<Exercise>(
            (search) => this.dependencies.itemServices.exerciseService.items()
                .include('ExerciseCategory')
                .whereLike('ExerciseName', search)
        )
            .withFields([
                { name: item => 'Name', value: item => item.exerciseName },
                { name: item => 'Category', value: item => item.exerciseCategory.categoryName },
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
            .avatarIcon(item => 'language')
            .deleteAction((item) => this.dependencies.itemServices.exerciseService.delete(item.id), item => item.exerciseName)
            .build();

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
