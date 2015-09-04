function randomTest(randgen, teacher, count) {
  count = count || 100;
  var cases = [];
  for (var i = 0; i < count; ++i) {
    var rand1 = randgen();
    var rand2 = randgen();
    var ans1 = teacher(rand1, rand2);
    var ans2 = teacher(rand2, rand1);
    
    cases.push(
      {
        name: 'rand ' + String(rand1) + ' ' + String(rand2),
        desc: 'rand',
        input: [String(rand1), String(rand2)],
        expect: String(ans1),
      }
    );
    cases.push(
      {
        name: 'rand ' + String(rand2) + ' ' + String(rand1),
        desc: 'rand',
        input: [String(rand2), String(rand1)],
        expect: String(ans2),
      }
    );
  }
  return cases;
}

module.exports = {
  randomTest: randomTest,
};
