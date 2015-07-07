// app.js

var Canvas = require('canvas')
  , Image = Canvas.Image
  , fs = require('fs')
  , config = require('./config')
  , interpreter = require('./interpreter');

function main(image) {
    var canvas = new Canvas(config.width * config.codel, config.height * config.codel);
    var ctx = canvas.getContext('2d');

    ctx.drawImage(image, 0, 0);

    var code = new Array(config.height);
    for(var i = 0; i < config.height; ++i) {
	code[i] = new Array(config.width);
    }
    // 確かに効率は悪い、しかし、それが問題となるほどの大きさのPietを描けるのでしょうか(余白作ればいいだけだから描けそうだ)。
    for(i = 0; i < config.height; ++i) {
	for(var j = 0; j < config.width; ++j) {
	    var color = pick_color(ctx, j * config.codel, i * config.codel);
	    for (var k in config.colors) {
		if (color === config.colors[k]) {
		    code[i][j] = k;
		    break;
		}
	    }
	}
    }

    console.log(interpreter.run(code, ''));
}

function pick_color(ctx, x, y) {
    var img = ctx.getImageData(x, y, 1, 1);
    var data = img.data;
    return (data[0] << 16) + (data[1] << 8) + (data[2] << 0);
}

fs.readFile(config.filename, function(err, data) {
    if (err) throw err;
    image = new Image();
    image.src = data;
    main(image);
});
