const utils = require('../utils');

const baseCases = [
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
    expect: '0',
  },
  {
    name: '3 5',
    desc: '3 5',
    input: ['3', '5'],
    expect: '3',
  },
  {
    name: '5 3',
    desc: '5 3',
    input: ['5', '3'],
    expect: '2',
  },
  {
    name: '2 -1',
    desc: '2 -1',
    input: '2 -1'.split(' '),
    expect: '0',
  },
  {
    name: '3 -2',
    desc: '3 -2',
    input: '3 -2'.split(' '),
    expect: '-1',
  },

];

function mod(n, m) {
  if (n === 0 || m === 0) return 0;
  const ans = n % m;
  if (ans === 0) return 0; // 割り切れていたらいずれにせよ0
  if (n > 0 && m > 0) return ans;
  if ((n > 0 && m < 0) ||
      (n < 0 && m > 0)) return ans + m;
  return ans; // n and m lt 0
}

function gen() {
  const mid = 10000;
  let rand = (Math.random() * mid) | 0;
  rand -= (mid / 2) | 0;
  return rand;
}

const randCases = utils.randomTest(gen, mod);

const cases = baseCases.concat(randCases);

module.exports = {
  cases,
};
