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

function getDependencies() {
	return new Promise( ( resolve ) => {
		getTeamRepos()
		.then( repoData => {
			const repos = [];

			for ( const repo of repoData ) {
				repos.push( {
					name: repo.full_name,
					composer: [],
					package: [],
				} );
			}

			return repos;
		} )
		.then( repos => Promise.all( repos.map( getComposer ) ) )
		.then( repos => Promise.all( repos.map( getPackage ) ) )
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
	reqOptions.url = `https://api.github.com/repos/${ repo.name }/contents/composer.json`;

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
				resolve( repo );
				return;
			}

			debug( 'Found composer', repo.name );

			const composer = JSON.parse( atob( body.content ) );

			const requires = composer.hasOwnProperty( 'require' ) ? Object.keys( composer.require ) : [];
			const requireDevs = composer.hasOwnProperty( 'require-dev' ) ? Object.keys( composer['require-dev'] ) : [];

			repo.composer = [ ...requires, ...requireDevs ];

			resolve( repo );
		} );
	} );
}

function getPackage( repo ) {
	reqOptions.url = `https://api.github.com/repos/${ repo.name }/contents/package.json`;

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
				debug( 'No package', repo.name );
				resolve( repo );
				return;
			}

			debug( 'Found package', repo.name );

			const packg = JSON.parse( atob( body.content ) );
			const dependencies = packg.hasOwnProperty( 'dependencies' ) ? Object.keys( packg.dependencies ) : [];
			const devDependencies = packg.hasOwnProperty( 'devDependencies' ) ? Object.keys( packg.devDependencies ) : [];

			repo.package = [ ...dependencies, ...devDependencies ];

			resolve( repo );
		} );
	} );
}

module.exports = {
	getPulls,
	getDependencies,
};
