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
}

findNextCodel = function(env, code) {
    var list = [];
    var color = code[env.x][env.y];
    var w = width(code);
    var h = height(code);

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

    var dp = env.dp, cc = env.cc;
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
    return nextCodel;
}

next = function(env, code) {
    var nextCodel = findNextCodel(env, code);

    console.log(nextCodel);
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
					return env.output;
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

    execCommand(env, currentColor, nextColor);
    env.x = nextCodel[0];
    env.y = nextCodel[1];

    return next(env, code);
};

var defaultEnv = {
    x: 0,
    y: 0,
    dp: 0,
    cc: 0,
    stack: [],
    input: '',
    output: '',
};

module.exports = {
    findNextCodel: findNextCodel,
    next: next,

    run: function(code, input) {
	var env = defaultEnv;
	env.input = input;
	return next(env, code);
    },
};
