// interpreter.js

/*
dp 
  0, 4, 8...: 右
  1, 5, 9...: 下
  2, 6, 10..: 左
  3, 7, 11..: 上

cc
  偶数: 左
  奇数: 右

code(x,y)
  0,0 0,1 0,2...
  1,0 1,1...
  2,0...
*/

let table = {
  'lred': [0, 0],
  'lyellow': [0, 1],
  'lgreen': [0, 2],
  'lcyan': [0, 3],
  'lblue': [0, 4],
  'lmagenta': [0, 5],

  'red': [1, 0],
  'yellow': [1, 1],
  'green': [1, 2],
  'cyan': [1, 3],
  'blue': [1, 4],
  'magenta': [1, 5],

  'dred': [2, 0],
  'dyellow': [2, 1],
  'dgreen': [2, 2],
  'dcyan': [2, 3],
  'dblue': [2, 4],
  'dmagenta': [2, 5],

  'white': [-1, 0],
  'black': [-1, -1],
};

function eq(l1, l2) {
  'use strict';
  if (l1.length !== l2.length) return false;
  for (let i = 0; i < l1.length; i++) {
    if (l1[i] !== l2[i]) return false;
  }
  return true;
}

function width(code) {
  'use strict';
  return code[0].length;
}
function height(code) {
  'use strict';
  return code.length;
}
function outside(code, codel) {
  'use strict';
  let w = width(code);
  let h = height(code);
  return (0 > codel[0] ||
          0 > codel[1] ||
          codel[0] >= h ||
          codel[1] >= w);
}

function unmovable(code, codel) {
  'use strict';
  if (outside(code, codel)) return true; // はみ出す
  return code[codel[0]][codel[1]] === 'black';
}

function mod(n, m) {
  if (n === 0 || m === 0 || n % m === 0) return 0;
  if ((n > 0 && m > 0) || (n < 0 && m < 0)) return n % m;
  return n % m + m;
}

function execCommand(env, currentColor, nextColor) {
  'use strict';
  if (currentColor === 'white' || nextColor === 'white') { return; /* nothing */ }
  let currentT = table[currentColor];
  let nextT = table[nextColor];

  let diffL = (nextT[0] - currentT[0] + 3) % 3;
  let diffH = (nextT[1] - currentT[1] +6) % 6;

  switch (diffH) {
    case 0:
      if (diffL === 0) { /* none */ }
      if (diffL === 1) { /* push */
        env.stack.push(env.area);
      }
      if (diffL === 2) { /* pop */
        env.stack.pop();
      }
      break;
    case 1:
      if (diffL === 0) { /* add */
        let tmp1 = env.stack.pop();
        let tmp2 = env.stack.pop();
        if (tmp1 !== undefined) {
          if (tmp2 !== undefined) {
            env.stack.push(tmp1 + tmp2);
          } else { // 2つ目が取れなかったので、スタックを戻す。
            env.stack.push(tmp1);
          }
        } else {
          // 一つも取れず失敗した。
        }
      }
      if (diffL === 1) { /* substract */
        let tmp1 = env.stack.pop();
        let tmp2 = env.stack.pop();
        if (tmp1 !== undefined) {
          if (tmp2 !== undefined) {
            env.stack.push(tmp2 - tmp1);
          } else { // 2つ目が取れなかったので、スタックを戻す。
            env.stack.push(tmp1);
          }
        } else {
          // 一つも取れず失敗した。
        }
      }
      if (diffL === 2) { /* multiply */
        let tmp1 = env.stack.pop();
        let tmp2 = env.stack.pop();
        if (tmp1 !== undefined) {
          if (tmp2 !== undefined) {
            env.stack.push(tmp1 * tmp2);
          } else { // 2つ目が取れなかったので、スタックを戻す。
            env.stack.push(tmp1);
          }
        } else {
          // 一つも取れず失敗した。
        }
      }
      break;
    case 2:
      if (diffL === 0) { /* divide */
        let tmp1 = env.stack.pop();
        let tmp2 = env.stack.pop();
        if (tmp1 !== undefined) {
          if (tmp2 !== undefined) {
            if (tmp1 !== 0) {
              env.stack.push((tmp2 / tmp1)|0);
            } else { // 失敗した。スタックを戻す。
              env.stack.push(tmp2);
              env.stack.push(tmp1);
            }
          } else { // 2つ目が取れなかったので、スタックを戻す。
            env.stack.push(tmp1);
          }
        } else {
	// 一つも取れず失敗した。
        }
      }
      if (diffL === 1) { /* mod */
        let tmp1 = env.stack.pop();
        let tmp2 = env.stack.pop();
        if (tmp1 !== undefined) {
          if (tmp2 !== undefined) {
            env.stack.push(mod(tmp2, tmp1));
          } else { // 2つ目が取れなかったので、スタックを戻す。
            env.stack.push(tmp1);
          }
        } else {
          // 一つも取れず失敗した。
        }
      }
      if (diffL === 2) { /* not */
        let tmp = env.stack.pop();
        if (tmp !== undefined) {
          if (tmp === 0) {
            env.stack.push(1);
          } else {
            env.stack.push(0);
          }
        } else {
          // 取れなかった場合なので積まない。
        }
      }
      break;
    case 3:
      if (diffL === 0) { /* greater */
        let tmp1 = env.stack.pop();
        let tmp2 = env.stack.pop();
        if (tmp1 !== undefined) {
          if (tmp2 !== undefined) {
            if (tmp2 > tmp1) {
              env.stack.push(1);
            } else {
              env.stack.push(0);
            }
          } else { // 2つ目が取れなかったので、スタックを戻す。
            env.stack.push(tmp1);
          }
        } else {
          // 一つも取れず失敗した。
        }
      }
      if (diffL === 1) { /* pointer */
        let tmp = env.stack.pop();
        if (tmp !== undefined) {
          env.dp += tmp;
        } else {
          // 取れなかった。
        }
      }
      if (diffL === 2) { /* switch */
        let tmp = env.stack.pop();
        if (tmp !== undefined) {
          env.cc += tmp;
        } else {
           // 取れなかった。
        }
      }
      break;
    case 4:
      if (diffL === 0) { /* duplicate */
        let tmp = env.stack.pop();
        if (tmp !== undefined) {
          env.stack.push(tmp);
          env.stack.push(tmp);
        } else {
          // 取れなかった。
        }
      }
      if (diffL === 1) { /* roll */
        // めんどくさい
        let tmp1 = env.stack.pop();
        let tmp2 = env.stack.pop();
        if (tmp1 !== undefined) {
          if (tmp2 !== undefined) {
            if (tmp2 < 0) { // 深さが負のロールは失敗する。
              env.stack.push(tmp2);
              env.stack.push(tmp1);
            } else { // ここ
              let fail = false;
              let view = new Array(tmp2);
              for (let i = 0; i < tmp2; ++i) {
                view[i] = env.stack.pop();
              }
              for (i = tmp2; i > 0; --i) { // 失敗してないかな？
                if (view[i-1] === undefined) {
                  break;
                }
              }
              if (i !== 0) { // 失敗してた。
                let last = i;
                fail = true;
                for (i = 0; i < last; ++i) { // 巻き戻す。
                  env.stack.push(view[i]);
                }
              }
              if (!fail) {
                let res = new Array(tmp2);
                for (let i = 0; i < res.length; ++i) {
                  res[i] = view[(i+tmp1)%tmp2];
                }
                let l = res.length;
                for (let i = 0; i < l; ++i) {
                  env.stack.push(res.pop());
                }
              }
            }
          } else { // 2つ目が取れなかったので、スタックを戻す。
            env.stack.push(tmp1);
          }
        } else {
          // 一つも取れず失敗した。
        }
      }
      if (diffL === 2) { /* in(num) */
        let tmp = env.input.shift();
        let num = parseInt(tmp, 10);
        if (!Number.isNaN(num)) {
          env.stack.push(num);
        } else {
          // どうしよう？
        }
      }
      break;
    case 5:
      if (diffL === 0) { /* in(char) */
        let tmp = env.input.shift();
        let num = tmp.charCodeAt(0);
        env.stack.push(num);
      }
      if (diffL === 1) { /* out(num) */
        let tmp = env.stack.pop();
        if (tmp !== undefined) {
          env.output += tmp.toString();
        }
      }
      if (diffL === 2) { /* out(char) */
        let tmp = env.stack.pop();
        if (tmp !== undefined) {
          env.output += String.fromCharCode(tmp);
        }
      }
      break;
    default:
      /* never come */
  }
}

function findNextCodelImp(env, code) {
  'use strict';
  let list = [];
  let color = code[env.x][env.y];
  let w = width(code);
  let h = height(code);
  let dp = env.dp, cc = env.cc;

  // 同色の探索
  let que = [[env.x, env.y]];
  let done = [];
  while (que.length > 0) {
    let point = que.shift();
    done.push(point);
    if (code[point[0]][point[1]] !== color) {
      continue;
    }
    list.push(point);
    if (point[0] !== 0) {
      let newp = [point[0] - 1, point[1]];
      let ins = true;
      for (let p of done) {
        if (eq(p, newp)) {
          ins = false;
          break;
        }
      }
      if (ins) {
        for (let p of que) {
          if (eq(p, newp)) {
            ins = false;
            break;
          }
        }
      }
      if (ins) que.push(newp);
    }
    if (point[1] !== 0) {
      let newp = [point[0], point[1] - 1];
      let ins = true;
      for (let p of done) {
        if (eq(p, newp)) {
          ins = false;
          break;
        }
      }
      if (ins) {
        for (let p of que) {
          if (eq(p, newp)) {
            ins = false;
            break;
          }
        }
      }
      if (ins) que.push(newp);
    }
    if (point[0] !== h - 1) {
      let newp = [point[0] + 1, point[1]];
      let ins = true;
      for (let p of done) {
        if (eq(p, newp)) {
          ins = false;
          break;
        }
      }
      if (ins) {
        for (let p of que) {
          if (eq(p, newp)) {
            ins = false;
            break;
          }
        }
      }
      if (ins) que.push(newp);
    }
    if (point[1] !== w - 1) {
      let newp = [point[0], point[1] + 1];
      let ins = true;
      for (let p of done) {
        if (eq(p, newp)) {
          ins = false;
          break;
        }
      }
      if (ins) {
        for (let p of que) {
          if (eq(p, newp)) {
            ins = false;
            break;
          }
        }
      }
      if (ins) que.push(newp);
    }
  }

  let area = list.length;

  let nextCodel = [-1, -1];
  switch (dp % 4) {
    case 0:
      let max = -1;
      for (let p of list) max = Math.max(max, p[1]);
      list = list.filter(function(p){ return p[1] == max; });
      if (list.length !== 1){
        // cc を考慮
        if (cc % 2 === 0) {
          let min = Infinity;
          for (let p of list) min = Math.min(min, p[0]);
          list = list.filter(function(p){ return p[0] == min; });
        } else {
          let max = -1;
          for (let p of list) max = Math.max(max, p[0]);
          list = list.filter(function(p){ return p[0] == max; });
        }
      }
      nextCodel = list[0];
      nextCodel[1] += 1;
      break;
    case 1:
      let max = -1;
      for (let p of list) max = Math.max(max, p[0]);
      list = list.filter(function(p){ return p[0] == max; });
      if (list.length !== 1) {
        // cc を考慮
        if (cc % 2 === 0) {
          let max = -1;
          for (let p of list) max = Math.max(max, p[1]);
          list = list.filter(function(p){ return p[1] == max; });
        } else {
          let min = Infinity;
          for (let p of list) min = Math.min(min, p[1]);
          list = list.filter(function(p){ return p[1] == min; });
        }
      }
      nextCodel = list[0];
      nextCodel[0] += 1;
      break;
    case 2:
      let min = Infinity;
      for (let p of list) min = Math.min(min, p[1]);
      list = list.filter(function(p){ return p[1] == min; });
      if (list.length !== 1) {
        // cc を考慮
        if (cc % 2 === 0) {
          let max = -1;
          for (let p of list) max = Math.max(max, p[0]);
          list = list.filter(function(p){ return p[0] == max; });
        } else {
          let min = Infinity;
          for (let p of list) min = Math.min(min, p[0]);
          list = list.filter(function(p){ return p[0] == min; });
        }
      }
      nextCodel = list[0];
      nextCodel[1] -= 1;
      break;
    case 3:
      let min = Infinity;
      for (let p of list) min = Math.min(min, p[0]);
      list = list.filter(function(p){ return p[0] == min; });
      if (list.length !== 1) {
        // cc を考慮
        if (cc % 2 === 0) {
          let max = -1;
          for (let p of list) max = Math.max(max, p[1]);
          list = list.filter(function(p){ return p[1] == max; });
        } else {
          let min = Infinity;
          for (let p of list) min = Math.min(min, p[1]);
          list = list.filter(function(p){ return p[1] == min; });
        }
      }
      nextCodel = list[0];
      nextCodel[0] -= 1;
      break;
    default:
      // never come
  }
  // process.stdout.write("findNext: ");
  // process.stdout.write(nextCodel.toString());
  // process.stdout.write("\n");
  // console.log(list)
  // process.stdout.write("#########\n");

  // ここに来た時、listの長さは1となっている。


  nextCodel[2] = area; // 現在の色の広さ こんなところに突っ込むのは気持ち悪いけど……。
  return nextCodel;
}

function findNextCodel(env, code) {
  'use strict';
  let point = findNextCodelImp(env, code);

  if (outside(code, point)) { return point; }
  let color = code[point[0]][point[1]];

  point['exec'] = true;
  if (color === 'white') {
    point['exec'] = false;
    while (!outside(code, point) && code[point[0]][point[1]] === 'white') { // まっすぐ進む
      switch (env.dp % 4) {
        case 0:
          point[1]++;
          break;
        case 1:
          point[0]++;
          break;
        case 2:
          point[1]--;
          break;
        case 3:
          point[0]--;
          break;
      }
    }
  }
  return point;
}

next = function(env, code) {
  'use strict';
  let nextCodel = findNextCodel(env, code);

  // ここなんとかしたい。
  if (unmovable(code, nextCodel)) {
    env.cc++;
    nextCodel = findNextCodel(env, code);
    if (unmovable(code, nextCodel)) {
      env.dp++;
      nextCodel = findNextCodel(env, code);
      if (unmovable(code, nextCodel)) {
        env.cc++;
        nextCodel = findNextCodel(env, code);
        if (unmovable(code, nextCodel)) {
          env.dp++;
          nextCodel = findNextCodel(env, code);
          if (unmovable(code, nextCodel)) {
            env.cc++;
            nextCodel = findNextCodel(env, code);
            if (unmovable(code, nextCodel)) {
              env.dp++;
              nextCodel = findNextCodel(env, code);
              if (unmovable(code, nextCodel)) {
                env.cc++;
                nextCodel = findNextCodel(env, code);
                if (unmovable(code, nextCodel)) {
                  env.dp++;
                  nextCodel = findNextCodel(env, code);
                  if (unmovable(code, nextCodel)) {
                    // おしまい
                    return 'stop';
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  let currentColor = code[env.x][env.y];
  let nextColor = code[nextCodel[0]][nextCodel[1]];

  // console.log(nextCodel)
  // console.log("current:" + currentColor + ", next: " + nextColor)
  // console.log(env.stack)
  // console.log(env.area)
  // process.stdout.write("dp: " + env.dp.toString());
  // process.stdout.write(", cc: " + env.cc.toString() + "\n");

  env.area = nextCodel[2];
  if (nextCodel['exec']) {
    execCommand(env, currentColor, nextColor);
  }
  env.x = nextCodel[0];
  env.y = nextCodel[1];

  return 'cont';
};

function run(env, code) {
  'use strict';
  let status = 'init';
  while (status !== 'stop') {
    status = next(env, code);
  }
  return env.output;
}

let defaultEnv = {
  x: 0,
  y: 0,
  dp: 0,
  cc: 0,
  stack: [],
  input: [],
  output: '',
  area: 0,
};

module.exports = {
  next: next,

  run: function(code, input) {
    'use strict';
    let env = {};
    env.x = env.y = env.dp = env.cc = env.area = 0;
    env.stack = [];
    env.input = input;
    env.output = '';
    return run(env, code);
  },
};
