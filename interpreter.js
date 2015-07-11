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

var table = {
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
    if (l1.length !== l2.length) return false;
    for (var i = 0; i < l1.length; i++) {
	if (l1[i] !== l2[i]) return false;
    }
    return true;
}

function width(code) { return code[0].length; }
function height(code) { return code.length; }
function outside(code, codel) {
    var w = width(code);
    var h = height(code);
    return (0 > codel[0]
         || 0 > codel[1]
         || codel[0] >= h
         || codel[1] >= w);
}

function unmovable(code, codel) {
    if (outside(code, codel)) return true; // はみ出す
    return code[codel[0]][codel[1]] === 'black';
}

function execCommand(env, currentColor, nextColor) {
    if (currentColor === 'white' || nextColor === 'white') { return; /* nothing */ }
    var currentT = table[currentColor];
    var nextT = table[nextColor];

    var diffL = (nextT[0] - currentT[0] + 3) % 3;
    var diffH = (nextT[1] - currentT[1] +6) % 6;

    switch (diffH) {
    case 0:
	if (diffL === 0) { /* none */ }
	if (diffL === 1) { /* push */
	    // console.log("push");
	    // console.log(env.stack);
	    env.stack.push(env.area);
	    // console.log(env.stack);
	    // console.log("#push");
	}
	if (diffL === 2) { /* pop */
	    // console.log("pop");
	    env.stack.pop();
	}
	break;
    case 1:
	if (diffL === 0) { /* add */
	    // console.log("add");
	    var tmp1 = env.stack.pop();
	    var tmp2 = env.stack.pop();
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
	    // console.log("sub");
	    var tmp1 = env.stack.pop();
	    var tmp2 = env.stack.pop();
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
	    // console.log("mul");
	    var tmp1 = env.stack.pop();
	    var tmp2 = env.stack.pop();
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
	    // console.log("div");
	    var tmp1 = env.stack.pop();
	    var tmp2 = env.stack.pop();
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
	    // console.log("mod");
	    // console.log(env.stack);
	    // console.log("#mod");
	    var tmp1 = env.stack.pop();
	    var tmp2 = env.stack.pop();
	    if (tmp1 !== undefined) {
		if (tmp2 !== undefined) {
		    if (tmp1 !== 0) {
			env.stack.push(tmp2 % tmp1);
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
	if (diffL === 2) { /* not */
	    // console.log("not");
	    var tmp = env.stack.pop();
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
	    // console.log("greater");
	    // console.log(env.stack);
	    var tmp1 = env.stack.pop();
	    var tmp2 = env.stack.pop();
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
	    // console.log("pointer");
	    var tmp = env.stack.pop();
	    // console.log("#pointer: dp + " + tmp)
	    if (tmp !== undefined) {
		env.dp += tmp;
	    } else {
		// 取れなかった。
	    }
	}
	if (diffL === 2) { /* switch */
	    // console.log("switch");
	    var tmp = env.stack.pop();
	    if (tmp !== undefined) {
		env.cc += tmp;
	    } else {
		// 取れなかった。
	    }
	}
	break;
    case 4:
	if (diffL === 0) { /* duplicate */
	    // console.log("dup");
	    var tmp = env.stack.pop();
	    if (tmp !== undefined) {
		env.stack.push(tmp);
		env.stack.push(tmp);
	    } else {
		// 取れなかった。
	    }
	}
	if (diffL === 1) { /* roll */
	    // console.log("roll")
	    // めんどくさい
	    var tmp1 = env.stack.pop();
	    var tmp2 = env.stack.pop();
	    if (tmp1 !== undefined) {
		if (tmp2 !== undefined) {
		    if (tmp2 < 0) { // 深さが負のロールは失敗する。
			env.stack.push(tmp2);
			env.stack.push(tmp1);
		    } else { // ここ
			// console.log("pre")
			// console.log(env.stack)
			// console.log(tmp1)
			// console.log(tmp2)
			var fail = false;
			var view = new Array(tmp2);
			for (var i = 0; i < tmp2; ++i) {
			    view[i] = env.stack.pop();
			}
			for (i = tmp2; i > 0; --i) { // 失敗してないかな？
			    if (view[i-1] === undefined) {
				break;
			    }
			}
			if (i !== 0) { // 失敗してた。
			    var last = i;
			    fail = true;
			    for (i = 0; i < last; ++i) { // 巻き戻す。
				env.stack.push(view[i]);
			    }
			}
			// console.log(view)
			// console.log(env.stack)
			// console.log(fail)
			if (!fail) {
			    var res = new Array(tmp2);
			    for (var i = 0; i < res.length; ++i) {
				res[i] = view[(i+tmp1)%tmp2];
			    }
			    // console.log(res)
			    // console.log(env.stack)
			    for (var i = 0; i < res.length; ++i) {
				env.stack.push(res[i]);
			    }
			}
			// console.log("post")
			// console.log(env.stack)
		    }
		} else { // 2つ目が取れなかったので、スタックを戻す。		    env.stack.push(tmp1);
		}
	    } else {
		// 一つも取れず失敗した。
	    }
	}
	if (diffL === 2) { /* in(num) */
	    var tmp = env.input.shift();
	    var num = parseInt(tmp, 10);
	    if (!Number.isNaN(num)) {
		env.stack.push(num);
	    } else {
		// どうしよう？
	    }
	}
	break;
    case 5:
	if (diffL === 0) { /* in(char) */
	    var tmp = env.input.shift();
	    var num = tmp.charCodeAt(0);
	    env.stack.push(num);
	}
	if (diffL === 1) { /* out(num) */
	    var tmp = env.stack.pop();
	    if (tmp !== undefined) {
		env.output += tmp.toString();
	    }
	}
	if (diffL === 2) { /* out(char) */
	    var tmp = env.stack.pop();
	    if (tmp !== undefined) {
		env.output += String.fromCharCode(tmp);
	    }
	}
	break;
    }
}

function findNextCodelImp(env, code) {
    var list = [];
    var color = code[env.x][env.y];
    var w = width(code);
    var h = height(code);
    var dp = env.dp, cc = env.cc;

    // 同色の探索
    var que = [[env.x, env.y]];
    var done = [];
    while (que.length > 0) {
	var point = que.shift();
	done.push(point);
	if (code[point[0]][point[1]] !== color) {
	    continue;
	}
	list.push(point);
	if (point[0] !== 0) {
	    var newp = [point[0] - 1, point[1]];
	    var ins = true;
	    for (var p of done) {
		if (eq(p, newp)) {
		    ins = false;
		    break;
		}
	    }
	    if (ins) {
		for (var p of que) {
		    if (eq(p, newp)) {
			ins = false;
			break;
		    }
		}
	    }
	    if (ins) que.push(newp);
	}
	if (point[1] !== 0) {
	    var newp = [point[0], point[1] - 1];
	    var ins = true;
	    for (var p of done) {
		if (eq(p, newp)) {
		    ins = false;
		    break;
		}
	    }
	    if (ins) {
		for (var p of que) {
		    if (eq(p, newp)) {
			ins = false;
			break;
		    }
		}
	    }
	    if (ins) que.push(newp);
	}
	if (point[0] !== h - 1) {
	    var newp = [point[0] + 1, point[1]];
	    var ins = true;
	    for (var p of done) {
		if (eq(p, newp)) {
		    ins = false;
		    break;
		}
	    }
	    if (ins) {
		for (var p of que) {
		    if (eq(p, newp)) {
			ins = false;
			break;
		    }
		}
	    }
	    if (ins) que.push(newp);
	}
	if (point[1] !== w - 1) {
	    var newp = [point[0], point[1] + 1];
	    var ins = true;
	    for (var p of done) {
		if (eq(p, newp)) {
		    ins = false;
		    break;
		}
	    }
	    if (ins) {
		for (var p of que) {
		    if (eq(p, newp)) {
			ins = false;
			break;
		    }
		}
	    }
	    if (ins) que.push(newp);
	}
    }

    var area = list.length;

    var nextCodel = [-1, -1];
    switch (dp % 4) {
    case 0:
	var max = -1;
	for (var p of list) max = Math.max(max, p[1])
	list = list.filter(function(p){ return p[1] == max; });
	if (list.length !== 1){
	    // cc を考慮
	    if (cc % 2 === 0) {
		var min = Infinity;
		for (var p of list) min = Math.min(min, p[0])
		list = list.filter(function(p){ return p[0] == min; });
	    } else {
		var max = -1;
		for (var p of list) max = Math.max(max, p[0])
		list = list.filter(function(p){ return p[0] == max; });
	    }
	}
	nextCodel = list[0];
	nextCodel[1] += 1;
	break;
    case 1:
	var max = -1;
	for (var p of list) max = Math.max(max, p[0])
	list = list.filter(function(p){ return p[0] == max; });
	if (list.length !== 1) {
	    // cc を考慮
	    if (cc % 2 === 0) {
		var max = -1;
		for (var p of list) max = Math.max(max, p[1])
		list = list.filter(function(p){ return p[1] == max; });
	    } else {
		var min = Infinity;
		for (var p of list) min = Math.min(min, p[1])
		list = list.filter(function(p){ return p[1] == min; });
	    }
	}
	nextCodel = list[0];
	nextCodel[0] += 1;
	break;
    case 2:
	var min = Infinity;
	for (var p of list) min = Math.min(min, p[1])
	list = list.filter(function(p){ return p[1] == min; });
	if (list.length !== 1) {
	    // cc を考慮
	    if (cc % 2 === 0) {
		var max = -1;
		for (var p of list) max = Math.max(max, p[0])
		list = list.filter(function(p){ return p[0] == max; });
	    } else {
		var min = Infinity;
		for (var p of list) min = Math.min(min, p[0])
		list = list.filter(function(p){ return p[0] == min; });
	    }
	}
	nextCodel = list[0];
	nextCodel[1] -= 1;
	break;
    case 3:
	var min = Infinity;
	for (var p of list) min = Math.min(min, p[0])
	list = list.filter(function(p){ return p[0] == min; });
	if (list.length !== 1) {
	    // cc を考慮
	    if (cc % 2 === 0) {
		var max = -1;
		for (var p of list) max = Math.max(max, p[1])
		list = list.filter(function(p){ return p[1] == max; });
	    } else {
		var min = Infinity;
		for (var p of list) min = Math.min(min, p[1])
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
    var point = findNextCodelImp(env, code);

    if (outside(code, point)) { return point; }
    var color = code[point[0]][point[1]];

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
    var nextCodel = findNextCodel(env, code);

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

    var currentColor = code[env.x][env.y];
    var nextColor = code[nextCodel[0]][nextCodel[1]];

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
    var status = 'init';
    while (status !== 'stop') {
	status = next(env, code);
    }
    return env.output;
}

var defaultEnv = {
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
	var env = {};
	env.x = env.y = env.dp = env.cc = env.area = 0;
	env.stack = [];
	env.input = input;
	env.output = '';
	return run(env, code);
    },
};
