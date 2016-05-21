import angular from 'angular';
import { name as moduleName } from '../module';
import { colors } from '../../../api/colors';

import './sequenceGraph.html';


function SequenceGraph() {

    return {
        restrict: 'E',
        scope: {
            sequence: '<',
            bpm: '<',
            height: '@?',
            width: '@?'
        },
        templateUrl: 'imports/ui/editor/components/sequenceGraph.html',
        link: function postLink(scope, elem, attrs) {

            let _canvas = elem.find('canvas')[0];
            let ctx = _canvas.getContext("2d");
            let height = scope.height && parseInt(scope.height) || 20;
            let half_height = height / 2;
            let width = (!scope.width || scope.width === 'auto') ? 'auto' : parseInt(scope.width);
            let blk_width = 1;
            let refresh_job = null;

            window.addEventListener('resize', resizeCanvas, false);
            resizeCanvas();

            scope.$watch('bpm', (bpm)=> {
                setup();
                draw();
            });

            scope.$watch('sequence', (sequence)=> {
                setup();
                draw();
            })

            scope.$on('$destroy', function() {
                window.removeEventListener('resize', resizeCanvas, false);
                if (refresh_job) {
                    clearInterval(refresh_job);
                    refresh_job = null;
                }
            });

            function setup() {
                if (!_canvas) _canvas = elem.find('canvas')[0];
                if (!ctx) ctx = _canvas.getContext("2d");
                if (!height) height = scope.height && parseInt(scope.height) || 20;
                if (!half_height) half_height = height / 2;
                if (!width) width = (!scope.width || scope.width === 'auto') ? 'auto' : parseInt(scope.width);

                blk_width = (_canvas.width / scope.sequence.length) | 0;

                if (!scope.bpm) {
                    scope.bpm = 1;
                }
                if (refresh_job) {
                    clearInterval(refresh_job);
                    refresh_job = null;
                }
            }

            function draw() {
                let x = 0;
                let has_random = false

                scope.sequence.forEach((color) => {
                    if (color === 'random') {
                        let c = colors.random();
                        let c2 = c;
                        ctx.fillStyle = c;
                        ctx.fillRect(x, 0, blk_width, half_height);

                        while (c === c2) c2 = colors.random();
                        ctx.fillStyle = c2;
                        ctx.fillRect(x, half_height, blk_width, half_height);

                        has_random = true;
                    }
                    else {
                        let c = color;
                        ctx.fillStyle = c;
                        ctx.fillRect(x, 0, blk_width, height);
                    }
                    x += blk_width;
                })

                if (x < _canvas.width) {
                    ctx.fillStyle = "#fff";
                    ctx.fillRect(x, 0, _canvas.width - x, height);
                }

                if (has_random && !refresh_job) {
                    refresh_job = setInterval(() => {
                        draw();
                    }, 60000 / scope.bpm);
                }
                else if (!has_random && refresh_job) {
                    clearInterval(refresh_job);
                    refresh_job = null;
                }
            }

            function resizeCanvas() {
                if (_canvas) {
                    _canvas.width = width === 'auto' && elem[0].clientWidth || width;
                    _canvas.height = height;

                    setup();
                    draw();
                }
            }

        }
    }

}


angular.module(moduleName).directive('sequenceGraph', SequenceGraph);
