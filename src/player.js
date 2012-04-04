var spawn = require('child_process').spawn

var args = ['-slave', '-quiet'];
for (var i=2 ; i<process.argv.length; ++i) {
	args.push(process.argv[i]);
}
console.log(JSON.stringify(args))

var mplayer = spawn('mplayer', args);
mplayer.on('exit', function (code) {
	console.log('mplayer has exited');
	process.exit(code)
});

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
	if (chunk == 'stop\n') {
		console.log("told me to stop");
		mplayer.stdin.write('quit\n');
	}
	else if (chunk == 'next\n') {
		mplayer.stdin.write('pausing_keep_force pt_step 1\n');

	  process.stdout.write('data: ' + chunk);
	}
});

process.stdin.on('end', function () {
  process.stdout.write('end');
});
