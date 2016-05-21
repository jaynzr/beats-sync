import angular from 'angular';
import { TimeSync } from 'meteor/mizzao:timesync';
import { name as moduleName } from './module';

import './timeStats.html';


export class TimeStats {

    constructor($scope, $reactive, $log) {
        'ngInject';

        $reactive(this).attach($scope);

        this.helpers(
            {
                time_diff() {
                    return TimeSync.serverOffset();
                }
            }
        )

        $scope.$watch(
            ()=> {
                return this.time_diff;
            },
            (time_diff)=> {
                if (time_diff !== undefined) $log.debug('time_diff', time_diff);
            }
        )

    }

}

const componentName = 'timeStats';

const componentOptions = {
  templateUrl: `imports/ui/components/${componentName}.html`,
  controller: TimeStats
}

angular.module(moduleName).component(componentName, componentOptions)