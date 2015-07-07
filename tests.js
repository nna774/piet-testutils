// tests.js

var cases = [
    {
	name: '6',
	desc: '6から始まる',
	input: [6],
	expect: '6310',
    },
    {
	name: '18',
	desc: '18から始まる',
	input: [18],
	expect: '1894210',
    },
    {
	name: '42',
	desc: '42から始まる',
	input: [42],
	expect: '4221105210',
    },
];

module.exports = {
    cases: cases,
};
