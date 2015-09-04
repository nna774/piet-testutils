var cases = [
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
    input: "2 -1".split(' '),
    expect: '0',
  },
  {
    name: '3 -2',
    desc: '3 -2',
    input: "3 -2".split(' '),
    expect: '-1',
  },

];

module.exports = {
  cases: cases,
};
