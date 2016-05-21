import angular from 'angular';
import angularMeteor from 'angular-meteor';
import ngFileUpload from 'ng-file-upload';
import 'ng-img-crop-full-extended/compile/minified/ng-img-crop';
import 'ng-img-crop-full-extended/compile/minified/ng-img-crop.css';
import { name as commonComponentsName } from '../components'

export const name = 'beats-editor-components';

angular.module(name, [
    angularMeteor,
    ngFileUpload,
    'ngImgCrop',
    commonComponentsName
])

;
