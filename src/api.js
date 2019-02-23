import queryString from 'query-string';

export default class API {
	constructor() {
		this.token = process.env.REACT_APP_GITHUB_TOKEN || '';
	}

	getTeamRepos( next ) {
		const endpoint = 'https://api.github.com/teams/2531752/repos';
		this.queryAPI( endpoint, {}, next );
	}

	getPullRequests( endpoint, next ) {
		endpoint = endpoint.replace( /{[^}]*}$/, '' );

		const params = {
			state: 'open',
			sort: 'created',
			created: 'asc',
		};

		this.queryAPI( endpoint, params, next );
	}

	queryAPI( endpoint, params = {}, next ) {
		const data = null;

		if ( params.length ) {
			endpoint += '?' + queryString.stringify( params );
		}

		const xhr = new XMLHttpRequest();
		// xhr.withCredentials = true;

		xhr.addEventListener( 'load', () => {
			if ( 200 === xhr.status ) {
				next( JSON.parse( xhr.responseText ) );
			} else {
				next( {
					error: xhr.responseText,
				} );
			}
		});

		xhr.open( 'GET', endpoint );

		xhr.setRequestHeader( 'Accept', 'application/vnd.github.v3+json' );
		xhr.setRequestHeader( 'Authorization', 'token ' + this.token );

		xhr.send( data );
	}
}
