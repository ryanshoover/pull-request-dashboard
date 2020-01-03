const express = require('express');
const ipfilter = require('express-ipfilter').IpFilter;
const cors = require('cors');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const debug = require('debug')('pull-request-backend:server');

// Ensure environment variables are read.
require('./config');

const reposRouter = require('./routes/repos');
const pullsRouter = require('./routes/pulls');
const dependenciesRouter = require('./routes/dependencies');

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;
const ips = process.env.IP_WHITELIST ? process.env.IP_WHITELIST.split(',') : ['127.0.0.1', '::1'];

// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
	console.error(`Node cluster master ${process.pid} is running`);

	// Fork workers.
	for (let i = 0; i < numCPUs; i++) {
		cluster.fork();
	}

	cluster.on('exit', (worker, code, signal) => {
		console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
	});

} else {
	const app = express();

	// Trust proxies for Heroku
	app.enable('trust proxy');

	// Block access to all but our allowed IP addresses.
	ipfilterConfig = {
		mode: 'allow',
		excluding: [
			'/api/*',
		],
	};

	// app.use( ipfilter( ips, ipfilterConfig ) );

	// Priority serve any static files.
	app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

	app.use(
		( request, response ) => {
			console.log( 'proxy enabled', app.enabled('trust proxy') );
			console.log( request.ip, request.ips );
		}
	);

	// Answer API requests.
	app.use('/api/repos', cors(), reposRouter);
	app.use('/api/pulls', cors(), pullsRouter);
	app.use('/api/dependencies', cors(), dependenciesRouter);

	// All remaining requests return the React app, so it can handle routing.
	app.get('*', function (request, response) {
		response.sendFile( path.resolve( __dirname, '../react-ui/build', 'index.html' ) );
	});

	app.listen(PORT, function () {
		console.error(`Node ${isDev ? 'dev server' : 'cluster worker ' + process.pid}: listening on port ${PORT}`);
	});
}
