export var colors = [
    'maroon',
    'red',
    'orange',
    'yellow',
    'olive',
    'purple',
    'fuchsia',
    'white',
    'lime',
    'green',
    'navy',
    'blue',
    'aqua',
    'teal',
    'black',
    'silver',
    'gray',
    'azure'
];

colors.random = function() {
    let idx = ((Math.random() * 100) % this.length)|0;
    return this[idx];
}
