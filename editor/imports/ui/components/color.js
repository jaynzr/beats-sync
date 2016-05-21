import angular from 'angular';
import { Meteor } from 'meteor/meteor';
import { TimeSync } from 'meteor/mizzao:timesync';
import { colors } from '../../api/colors';
import { Songs } from '../../api/songs';
import { name as moduleName } from './module';

import './color.html';

const CANVAS_FPM = 60;

let _canvas;
let _context;
let _play_colors, _divisor;
let _color_idx;
let _start = 0;


class Color {

    constructor($scope, $reactive) {
        'ngInject';

        this.syncTime = this.syncTime.bind(this);
        this.tick = this.tick.bind(this);
        this.resizeCanvas = this.resizeCanvas.bind(this);


        $reactive(this).attach($scope);

        this.sync_proc = null;
        this.synced_count = 0;
        if (this.height) {
            this.height = parseInt(this.height);
            this.resizeCanvas = this.resizeCanvas.bind(this);
        }
        let channel = this.channel || 'current';

        this.subscribe(`song.${channel}`);

        this.helpers(
            {
                song() {
                    let selector = {};
                    selector[channel] = true;
                    return Songs.findOne(selector);
                }
            }
        )

        $scope.$watch(()=>{
                return this.song;
            },
            (song)=>{
                this.play(song);
        })

    }

    $onInit() {
        window.addEventListener('pageshow', this.syncTime);
    }

    $postLink() {
        _canvas = document.getElementById("main");
        _context = _canvas.getContext('2d');

        window.addEventListener('resize', this.resizeCanvas, false);
        this.resizeCanvas();

        createjs.Ticker.setFPS(CANVAS_FPM);

        createjs.Ticker.addEventListener("tick", this.tick);

    }

    $onDestroy() {
        if (this.sync_proc) {
            clearInterval(this.sync_proc);
            this.sync_proc = null;
        }
        createjs.Ticker.removeEventListener("tick", this.tick);
        window.removeEventListener('resize', this.resizeCanvas, false);
        window.removeEventListener('pageshow', this.syncTime, false);
    }

    play(song) {
        if (song && song.play.start) {
            _start = song.play.start;
            _divisor = (60000 / song.bpm) | 0;
            if (song.play.type === 'section') {
                _play_colors = song.sections[song.play.value].sequence;
            }
            console.debug('play', song.name);
        }
        else {
            this.pause();
        }
    }

    pause() {
        _play_colors = ['black'];
        _divisor = 1;
        _start = 1;
        _color_idx = 1;
    }


    tick(ev) {
        if (!_play_colors || _play_colors.length === 0) return;
        if (_start === 0) return;

        let elapsed = ((TimeSync.serverTime(Date.now()) - _start) / _divisor) | 0;
        let idx = (elapsed % _play_colors.length) | 0;

        if (_color_idx !== idx) {
            _color_idx = idx;
            let c = _play_colors[idx] === 'random' ? colors.random() : _play_colors[idx];
            _context.fillStyle = c;
            _context.fillRect(0, 0, _canvas.width, _canvas.height);
            //console.debug(c, _canvas.width, _canvas.height);
        }
        //console.debug({_play_colors, _start, _color_idx, elapsed, idx, _divisor})

        if (_start === 1) {
            _start = 0;
        }

    }


    syncTime() {
        if (!this.sync_proc) {

            let RETRY = (TimeSync.serverOffset() > -100 && TimeSync.serverOffset() < 100) ? 1 : 3
            this.synced_count = 0;

            this.sync_proc = setInterval(()=>{
                    TimeSync.resync();
                    this.synced_count++;

                    if (this.synced_count > RETRY) {
                        clearInterval(this.sync_proc);

                        this.sync_proc = setInterval(() => {
                            TimeSync.resync();
                        }, 900000); //sync 15min
                    }
                }, 2000);
        }
    }

    resizeCanvas() {
        if (_canvas) {
            _canvas.width = window.innerWidth;
            _canvas.height = this.height || window.innerHeight;

            // TODO: verify this is needed to redraw image sequences
            this.tick();
        }
    }


}


const componentName = 'color';
const componentOptions = {
  templateUrl: `imports/ui/components/${componentName}.html`,
  controllerAs: componentName,
  controller: Color,
  bindings: {
      channel: '<?',
      height: '@?'
  }
}

angular.module(moduleName).component(componentName, componentOptions)