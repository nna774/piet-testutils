// app.js

let testfile = process.argv[3] || 'tests.js';
if (testfile[0] !== '/') testfile = `./${testfile}`;

const Canvas = require('canvas');
const fs = require('fs');
const easyimg = require('easyimage');
const interpreter = require('./interpreter');

const tests = require(testfile);
const config = require('./config');

const Image = Canvas.Image;

function pickColor(ctx, x, y) {
  'use strict';
  const img = ctx.getImageData(x, y, 1, 1);
  const data = img.data;
  return (data[0] << 16) + (data[1] << 8) + (data[2] << 0);
}

function main(image, info) {
  'use strict';
  const width = info.width / config.codel;
  const height = info.height / config.codel;
  const canvas = new Canvas(width * config.codel, height * config.codel);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(image, 0, 0);

  const code = new Array(height);
  for (let i = 0; i < height; ++i) {
    code[i] = new Array(width);
  }
  // 確かに効率は悪い、しかし、それが問題となるほどの大きさのPietを描けるのでしょうか(余白作ればいいだけだから描けそうだ)。
  for (let i = 0; i < height; ++i) {
    for (let j = 0; j < width; ++j) {
      const color = pickColor(ctx, j * config.codel, i * config.codel);
      for (const k in config.colors) {
        if (color === config.colors[k]) {
          code[i][j] = k;
          break;
        }
      }
    }
  }

  let all = true;
  for (const c of tests.cases) {
    const output = interpreter.run(code, c.input);
    if (output !== c.expect) {
      console.log(`test ${c.name} failed!`);
      console.log(`expected: ${c.expect}, but it puts ${output}`);
      all = false;
    } else {
      if (config.verbose) {
        console.log(`test ${c.name} passed!`);
      }
    }
  }
  if (all) {
    console.log('all tests passed!');
    process.exit(0);
  } else {
    console.log('some tests failed...');
    process.exit(1);
  }
}

if (process.argv.length < 3) {
  console.log('missing argument.');
  process.exit(-1);
}

const filename = process.argv[2];

easyimg.info(filename).then((info) => {
  fs.readFile(filename, (err, data) => {
    if (err) throw err;
    const image = new Image();
    image.src = data;
    main(image, info);
  });
}, (err) => {
  console.log(err);
});
