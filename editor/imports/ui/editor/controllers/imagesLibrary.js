import angular from 'angular';
import { Images } from '../../../api/images';
import { name as moduleName } from '../module';


import './imagesLibrary.html'


class ImagesLibrary {

    constructor($scope, $reactive) {
        'ngInject'

        $reactive(this).attach($scope);
        this.subscribe(`images`);

        this.helpers({
            images() {
                return Images.find({})
            }
        })

    }

    remove(img) {
        if (confirm('Do you really want to delete this image?\nThere is NO undo.')){
            Images.remove(img._id);
        }
    }

}


const componentName = 'imagesLibrary';

const componentOptions = {
    templateUrl: `imports/ui/editor/controllers/${componentName}.html`,
    controller: ImagesLibrary
}

angular.module(moduleName).component(componentName, componentOptions)
