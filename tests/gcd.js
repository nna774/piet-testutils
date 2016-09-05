const utils = require('../utils');

const cases = [
  {
    name: '1 2',
    desc: '1 2',
    input: ['1', '2'],
    expect: '1',
  },
  {
    name: '2 1',
    desc: '2 1',
    input: ['2', '1'],
    expect: '1',
  },
  {
    name: '3 5',
    desc: '3 5',
    input: ['3', '5'],
    expect: '1',
  },
  {
    name: '5 3',
    desc: '5 3',
    input: ['5', '3'],
    expect: '1',
  },
  {
    name: '4 8',
    desc: '4 8',
    input: ['4', '8'],
    expect: '4',
  },
  {
    name: '8 4',
    desc: '8 4',
    input: ['8', '4'],
    expect: '4',
  },

];

function gcd(n, m) {
  if (n < m) return gcd(m, n);
  const r = n % m;
  if (r === 0) return m;
  return gcd(m, r);
}

function gen() {
  const rand = (Math.random() * 10000) | 0;
  return rand + 1;
}

const randCases = utils.randomTest(gen, gcd);

module.exports = {
  cases: cases.concat(randCases),
};
