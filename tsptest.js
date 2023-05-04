var fs = require("fs");

var tsp = require('./tspsol');
const readline = require('readline');
var r1 = readline.createInterface({
	    input: process.stdin,
	    output: process.stdout
});


function main() {

	const argv = process.argv.slice(2);
	let width = parseInt(argv[0]);
	let height = parseInt(argv[1]);
	let seed = parseInt(argv[2]);

	let x = [];
	let y = [];

	let data = fs.readFileSync('/dev/stdin').toString();
	const lines = data.split(/\r?\n/);
	let n = parseInt(lines[0]);

	console.log("Number of nodes " + n);
	for(i = 1; i <= n; i++) {
		let a;
		let b;
		let line = lines[i];
		const coo = lines[i].split(" ");
		a = parseInt(coo[0]);
		b = parseInt(coo[1]);
		x.push(a);
		y.push(b);
	}
	console.log(x);
	console.log(y);

	console.log("width " + width);
	console.log("height " + height);

	let sx = 0;
	let sy = 0;
	let sol = tsp.solution_nearest(n, sx, sy, x, y);
	let length = sol[0];
	let curseq = sol[1];
	let simkey = n + " " + width + " " + height + " " + seed;
	console.log("nearestfinal " + simkey + " " + length);

	let plotkey = n + ":" + seed + ":" + width + ":" + height;
	let nearplotkey = "plotnear:" + plotkey;
	console.log(nearplotkey, sx, sy);
	for(i = 0; i < n; i++) {
		console.log(nearplotkey, x[curseq[i]], y[curseq[i]]);
	}
	console.log(nearplotkey, sx, sy);
	nearplotkey = "plotneardist:" + plotkey;
	console.log(nearplotkey, length.toFixed(2));

	sol = tsp.solution_sa(n, sx, sy, x, y);
	length = sol[0];
	curseq = sol[1];
	let saplotkey = "plotsa:" + plotkey;
	console.log(saplotkey, sx, sy);
	for(i = 0; i < n; i++) {
		console.log(saplotkey, x[curseq[i]], y[curseq[i]]);
	}
	console.log(saplotkey, sx, sy);
	saplotkey = "plotsadist:" + plotkey;
	console.log(saplotkey, length.toFixed(2));
	console.log("safinal " + simkey + " " + length);
	return 0;
}

main();



