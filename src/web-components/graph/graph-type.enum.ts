/**
 * For charts and info see https://swimlane.gitbooks.io/ngx-charts 
 */
export enum GraphTypeEnum{
    /* Not supported in typescript 2.3.x which is required by angular
    upgrade to following once typescript ugrade is possible
    !! Caution - Change also graph.component.ts !!
    LineChart = "LineChart",
    VerticalBarChart = "VerticalBarChart"
    */

    LineChart = 0,
    VerticalBarChart = 1
}