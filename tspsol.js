// Traveling Salesman Problem 
// Provide solutions with heuristic algorithm and simulated annealing
// Sanghwan Lee 2022.09.30 sanghwan@kookmin.ac.kr


// find the distance between two points in a plane
function DIST(x1, y1, x2, y2) {
	return (Math.sqrt(((x1) - (x2)) * ((x1) - (x2)) + ((y1) - (y2)) * ((y1) - (y2))));
}

// compute the distance from source (sx, sy) to all other nodes
function make_source_to_node(n, sx, sy, x, y) {
	let sd = new Array(n);
	for(i = 0; i < n; i++) {
		sd[i] = DIST(sx, sy, x[i], y[i]);
	}
	return sd;
}

// compute the distances among the nodes
function make_distmatrix(n, x, y) {
	let dm = new Array(n);
	for(i = 0; i < n; i++) {
		dm[i] = new Array(n);
		dm[i][i] = 0;
	}
	for(i = 0; i < n; i++) {
		for(j = i + 1; j < n; j++) {
			dm[i][j] = DIST(x[i], y[i], x[j], y[j]);
			dm[j][i] = dm[i][j];
		}
	}
	return dm;
}

// compute the distance of the given seq: starting from the source, visiting all the nodes, and returning to the source 
function eval_tsp(n, sd, dm, seq) {
	let dist = sd[seq[0]];

	for(i = 1; i < n; i++) {
		dist += dm[seq[i - 1]][seq[i]];
	}
	dist += sd[seq[n - 1]];
	return dist;
}


// From the traversing sequence, flip a part of the sequence and generate a new sequence 
function opt2swap(seq) {
	let n = seq.length;
	let j = parseInt(Math.random() * n);
	let k = parseInt(Math.random() * n);

	let p = [j, k];
	j = Math.min(...p);
	k = Math.max(...p);

	let newseq = [];
	for(i = 0; i < j; i++) {
		newseq.push(seq[i]);
	}
	for(i = k - 1; i >= j; i--) {
		newseq.push(seq[i]);
	}

	for(i = k; i < n; i++) {
		newseq.push(seq[i]);
	}
 
	return newseq;
}

// simulated annealing with coordinates of the source and the nodes
// n: number of nodes
// sx: x coordinate of the source
// sy: y coordinate of the source
// x: an array, x[i] is the x coordinates of node i
// y: an array, y[i] is the y coordinates of node i
// It just create distance matrices and call solution_sa_dm
function solution_sa(n, sx, sy, x, y) {
	let sd = make_source_to_node(n, sx, sy, x, y);
	let dm = make_distmatrix(n, x, y);

	return solution_sa_dm(n, sd, dm);
}

		
// simulated annealing with distances from the source to the nodes and distances among the nodes
// n: number of nodes
// sd: an array, sd[i] is the distance from the source to node i
// dm: a 2-dimensional array, dm[i][j] is the distance between node i and node j
function solution_sa_dm(n, sd, dm) {
	
	let initialsolution = solution_nearest_dm(n, sd, dm);

	let besteval = initialsolution[0];
	let bestseq = initialsolution[1];
	let cureval = besteval;
	let curseq = [...bestseq];

	//console.log(besteval);
	let T = 6000;
	let a1 = 5.0;
	let cnt = 0;
	while(T > 1e-5) {
		let newseq = opt2swap(curseq);
		let tmpeval = eval_tsp(n, sd, dm, newseq);

		if(Math.exp((cureval - tmpeval) / (a1 * T)) > Math.random()) {
			cureval = tmpeval;
			curseq = [...newseq];
		} 

		if (cureval < besteval) {
			besteval = cureval;
			bestseq = [...curseq];
		}
		T *= 0.9999;
		cnt ++;
	}

	//console.log("loop " + cnt);
	return [besteval, bestseq];
}



// nearest first algorithm with coordinates of the source and the nodes
// n: number of nodes
// sx: x coordinate of the source
// sy: y coordinate of the source
// x: an array, x[i] is the x coordinates of node i
// y: an array, y[i] is the y coordinates of node i
// It just create distance matrices and call solution_nearest_dm
function solution_nearest(n, sx, sy, x, y) {
	let sd = make_source_to_node(n, sx, sy, x, y);
	let dm = make_distmatrix(n, x, y);

	return solution_nearest_dm(n, sd, dm);
}

// nearest first algorithm with distances from the source to the nodes and distances among the nodes
// n: number of nodes
// sd: an array, sd[i] is the distance from the source to node i
// dm: a 2-dimensional array, dm[i][j] is the distance between node i and node j
function solution_nearest_dm(n, sd, dm) {
	let seq = [];
	let visited = Array(n).fill(0);

	let minv = Math.min(...sd);
	let cur = sd.indexOf(minv);
	visited[cur] = 1;
	seq[0] = cur;

	//console.log(dm);
	//console.log(dm[5][0], cur, minv, sd);
	for(i = 1; i < n; i++) {
		let cur = seq[i - 1]; 
		let dd = Number.MAX_SAFE_INTEGER;
		let nn = -1;
		for(j = 0; j < n; j++) {
			if(visited[j] == 1) 
				continue;
			let d = dm[cur][j];
			if (d < dd) {
				nn = j;
				dd = d;				
			}
		}
		visited[nn] = 1;
		seq.push(nn);
	}
	let len = eval_tsp(n, sd, dm, seq);

	return [len, seq];
}

exports.solution_sa = solution_sa;
exports.solution_sa_dm = solution_sa_dm;
exports.solution_nearest = solution_nearest;
exports.solution_nearest_dm = solution_nearest_dm;

