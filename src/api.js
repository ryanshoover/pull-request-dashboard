const request = require('request');

let teamRepos;

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
		if ( teamRepos ) {
			resolve( teamRepos );
		}

		request( options, ( err, res, body ) => {
			if ( err ) {
				reject( err );
			}

			teamRepos = body;

			resolve( teamRepos );
		} );
	})
}

function getPulls() {
	return new Promise( ( resolve ) => {
		getTeamRepos()
		.then( repos => {
			return Promise.all( repos.map( getRepoPulls ) );
		} )
		.then( repos => {
			const allPulls = [];

			repos.forEach( pulls => {
				pulls.forEach( pull => allPulls.push( pull ) );
			 } );

			resolve( allPulls );
		} )
		.catch( err => console.error( err ) );
	} );
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
				console.log( err );
				reject( err );
			}

			resolve( body );
		} );
	})
}

module.exports = {
	getTeamRepos,
	getPulls,
};
