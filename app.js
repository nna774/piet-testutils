// app.js

var testfile = process.argv[3] || 'tests.js';

var Canvas = require('canvas')
  , Image = Canvas.Image
  , fs = require('fs')
  , easyimg = require('easyimage')
  , config = require('./config')
  , interpreter = require('./interpreter')
  , tests = require('./' + testfile);

function main(image, info) {
  'use strict';
  var width = info.width / config.codel;
  var height = info.height / config.codel;
  var canvas = new Canvas(width * config.codel, height * config.codel);
  var ctx = canvas.getContext('2d');

  ctx.drawImage(image, 0, 0);

  var code = new Array(height);
  for(var i = 0; i < height; ++i) {
    code[i] = new Array(width);
  }
  // 確かに効率は悪い、しかし、それが問題となるほどの大きさのPietを描けるのでしょうか(余白作ればいいだけだから描けそうだ)。
  for(i = 0; i < height; ++i) {
    for(var j = 0; j < width; ++j) {
      var color = pick_color(ctx, j * config.codel, i * config.codel);
      for (var k in config.colors) {
	if (color === config.colors[k]) {
	  code[i][j] = k;
	  break;
	}
      }
    }
  }

  var all = true;
  for (var c of tests.cases) {
    var output = interpreter.run(code, c.input);
    if (output !== c.expect) {
      console.log("test " + c.name + " failed!");
      console.log("expected: " + c.expect + ", but it puts " + output);
      all = false;
    } else {
      if (config.verbose) {
        console.log("test " + c.name + " passed!");
      }
    }
  }
  if (all) {
    console.log("all tests passed!");
    process.exit(0);
  } else {
    console.log("some tests failed...");
    process.exit(1);
  }
}

function pick_color(ctx, x, y) {
  'use strict';
  var img = ctx.getImageData(x, y, 1, 1);
  var data = img.data;
  return (data[0] << 16) + (data[1] << 8) + (data[2] << 0);
}

if (process.argv.length < 3) {
  console.log('missing argument.');
  return;
}

var filename = process.argv[2];

easyimg.info(filename).then(
  function(info){
    fs.readFile(filename, function(err, data) {
      if (err) throw err;
      image = new Image();
      image.src = data;
      main(image, info);
    });
  },  function (err) {
    console.log(err);
  }
);
