function randomTest(randgen, teacher, count = 100) {
  const cases = [];
  for (let i = 0; i < count; ++i) {
    const rand1 = randgen();
    const rand2 = randgen();
    const ans1 = teacher(rand1, rand2);
    const ans2 = teacher(rand2, rand1);

    cases.push(
      {
        name: `rand ${String(rand1)} ${String(rand2)}`,
        desc: 'rand',
        input: [String(rand1), String(rand2)],
        expect: String(ans1),
      }
    );
    cases.push(
      {
        name: `rand ${String(rand2)} ${String(rand1)}`,
        desc: 'rand',
        input: [String(rand2), String(rand1)],
        expect: String(ans2),
      }
    );
  }
  return cases;
}

module.exports = {
  randomTest,
};
