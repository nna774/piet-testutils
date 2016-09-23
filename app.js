// app.js

let testfile = process.argv[3] || 'tests.js';
if (testfile[0] !== '/') testfile = `./${testfile}`;

const Canvas = require('canvas');
const fs = require('fs');
const easyimg = require('easyimage');
const interpreter = require('./interpreter');

const tests = require(testfile);
const config = require('./config');

const loader = require('piet-loader');

const Image = Canvas.Image;

function main(code) {
  let all = true;
  for (const c of tests.cases) {
    const output = interpreter.run(code, c.input);
    if (output !== c.expect) {
      console.log(`test ${c.name} failed!`);
      console.log(`expected: ${c.expect}, but it puts ${output}`);
      all = false;
    } else if (config.verbose) {
      console.log(`test ${c.name} passed!`);
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

loader.load(filename, config.codel).then(main);
