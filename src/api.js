const request = require( 'request' );
const atob = require( 'atob' );
const debug = require('debug')('pull-request-backend:server');

let reqOptions = {
	json: true,
	headers: {
		'Accept': 'application/vnd.github.v3+json',
		'Authorization': 'token ' + process.env.GITHUB_TOKEN,
		'User-Agent': 'pull-request-dashboard',
	}
};

function getPulls() {
	return new Promise( ( resolve ) => {
		getTeamRepos()
		.then( repos => Promise.all( repos.map( getRepoPulls ) ) )
		.then( repos => {
			const allPulls = [];

			repos.forEach( pulls => {
				pulls.forEach( pull => allPulls.push( pull ) );
			 } );

			return processPulls( allPulls );
		} )
		.then( data => resolve( data ) )
		.catch( err => console.error( 'getPulls catch', err ) );
	} );
}

function getProducts() {
	return new Promise( ( resolve ) => {
		getTeamRepos()
		.then( repos => Promise.all( repos.map( getComposer ) ) )
		.then( composers => processComposers( composers ) )
		.then( data => resolve( data ) )
		.catch( err => console.error( 'getProducts catch', err ) );
	} );
}

function getTeamRepos() {
	reqOptions.url = `https://api.github.com/teams/${ process.env.GITHUB_TEAM }/repos?per_page=100`;

	return new Promise( ( resolve, reject ) => {
		request( reqOptions, ( err, res, body ) => {
			if ( err ) {
				reject( err );
			}

			if ( 'object' !== typeof body ) {
				reject( 'Body is not an object' );
				return;
			}

			if ( body.hasOwnProperty( 'message' ) ) {
				reject( body.message );
				return;
			}

			const repos = body.filter( repo => repo.permissions.admin );

			debug( 'Number of repos', repos.length );

			resolve( repos );
		} );
	})
}

function getRepoPulls( repo ) {
	reqOptions.url = repo.pulls_url.replace( /{[^}]*}$/, '' );

	return new Promise( ( resolve, reject ) => {
		request( reqOptions, ( err, res, body ) => {
			if ( err ) {
				reject( err );
			}

			if ( 'object' !== typeof body ) {
				reject( 'Body is not an object' );
				return;
			}

			if ( body.hasOwnProperty( 'message' ) ) {
				reject( body.message );
				return;
			}

			resolve( body );
		} );
	})
}

function processPulls( pulls ) {
	const counts = {
		repos: {},
		reviewers: {},
		owners: {},
	};

	return new Promise( ( resolve ) => {
		pulls.forEach( ( pull ) => {
			pull.requested_reviewers.forEach( reviewer => {
				counts.reviewers[ reviewer.login ] = counts.reviewers[ reviewer.login ] || 0;
				counts.reviewers[ reviewer.login]++;
			} );

			const owner = pull.assignee || pull.user;
			counts.owners[ owner.login ] = counts.owners[ owner.login ] || 0;
			counts.owners[ owner.login ]++;

			const repo = pull.url.match( /\/repos\/[^/]+\/([^/]+)\// )[1];
			counts.repos[ repo ] = counts.repos[ repo ] || 0;
			counts.repos[ repo ]++;
		} );

		resolve( counts );
	} );
}

function getComposer( repo ) {
	reqOptions.url = repo.contents_url.replace( /{\+path}$/, 'composer.json' );

	return new Promise( ( resolve, reject ) => {
		request( reqOptions, ( err, res, body ) => {
			if ( err ) {
				reject( err );
			}

			if ( 'object' !== typeof body ) {
				reject( 'Body is not an object' );
				return;
			}

			if ( body.hasOwnProperty( 'message' ) ) {
				debug( 'No composer', repo.name );
				resolve( {} );
				return;
			}

			debug( 'Found composer', repo.name );

			const composer = JSON.parse( atob( body.content ) );

			resolve( composer );
		} );
	})
}

function processComposers( composers ) {
	const products = [];

	composers.forEach( composer => {
		if ( ! composer.hasOwnProperty( 'name' ) ) {
			return;
		}

		const product = {
			name: composer.name.replace( 'wpengine/', '' ),
			type: composer.type,
		};

		const dependencies = composer.hasOwnProperty( 'require' ) ? Object.keys( composer.require ) : [];

		dependencies.forEach( dependency => {
			const parts = dependency.split( '/' );
			product[ parts[0] ] = product[ parts[0] ] || [];
			product[ parts[0] ].push( parts[1] );
		} );

		products.push( product );
	} );

	return products;
}

module.exports = {
	getPulls,
	getProducts,
};
