// config.js

var codel = 10;
var filename = 'devide_by_2.10cs.11x4.png';

var verbose = false;

var colors = {
    'lred': 0xffc0c0, // light red
    'lyellow': 0xffffc0, // light yellow
    'lgreen': 0xc0ffc0, // light green
    'lcyan': 0xc0ffff, // light cyan
    'lblue': 0xc0c0ff, // light blue
    'lmagenta': 0xffc0ff, // light magenta

    'red': 0xff0000, // red
    'yellow': 0xffff00, // yellow
    'green': 0x00ff00, // green
    'cyan': 0x00ffff, // cyan
    'blue': 0x0000ff, // blue
    'magenta': 0xff00ff, // magenta

    'dred': 0xc00000, // dark red
    'dyellow': 0xc0c000, // dark yellow
    'dgreen': 0x00c000, // dark green
    'dcyan': 0x00c0c0, // dark cyan
    'dblue': 0x0000c0, // dark blue
    'dmagenta': 0xc000c0, // dark magenta

    'white': 0xffffff, // white
    'black': 0x000000, // black
};

// rewrite here
var config  = module.exports = {
    codel: codel,
    filename: filename,

    colors: colors,
    verbose: verbose,
};


