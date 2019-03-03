const request = require('request');

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

function getTeamRepos() {
	const options = {
		url: `https://api.github.com/teams/${ process.env.GITHUB_TEAM }/repos`,
		json: true,
		headers: {
			'Accept': 'application/vnd.github.v3+json',
			'Authorization': 'token ' + process.env.GITHUB_TOKEN,
			'User-Agent': 'pull-request-dashboard',
		}
	}

	return new Promise( ( resolve, reject ) => {
		request( options, ( err, res, body ) => {
			if ( err ) {
				reject( err );
			}

			if ( 'undefined' !== typeof body.message ) {
				reject( body.message );
			}

			resolve( body );
		} );
	})
}

function getRepoPulls( repo ) {
	const options = {
		url: repo.pulls_url.replace( /{[^}]*}$/, '' ),
		json: true,
		headers: {
			'Accept': 'application/vnd.github.v3+json',
			'Authorization': 'token ' + process.env.GITHUB_TOKEN,
			'User-Agent': 'pull-request-dashboard',
		}
	}

	return new Promise( ( resolve, reject ) => {
		request( options, ( err, res, body ) => {
			if ( err ) {
				reject( err );
			}

			if ( 'undefined' !== typeof body.message ) {
				reject( body.message );
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

module.exports = {
	getPulls,
};
