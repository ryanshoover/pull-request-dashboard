import React, { Component } from 'react';
import { Reviewers, Owners, Repos } from './components';
import API from './api';
import './app.css';

class App extends Component {
	constructor( props ) {
		super( props );

		this.api = new API();

		this.state = {
			repos: [],
			pulls: {},
		};
	}

	componentDidMount() {
		this.api.getTeamRepos( repos => {
			if ( repos.error ) {
				console.error( repos.error );
				return;
			}

			this.setState( {
				repos: repos,
			} );

			repos.map( this.updatePRs );
		} );
	}

	updatePRs = ( repo ) => {
		this.api.getPullRequests( repo.pulls_url, pulls => {
			if ( pulls.error ) {
				console.error( pulls.error );
				return;
			}

			if ( ! pulls.length ) {
				return;
			}

			this.setState( state => {
				state.pulls[ repo.node_id ] = pulls;
				return state;
			} );
		} );
	}

	render() {
		return (
			<div className="app">
				<header className="app-header">
					<h1>Pull Request Dashboard</h1>
				</header>
				<main className="app-main">
					<Reviewers pulls={ this.state.pulls } />
					<Owners pulls={ this.state.pulls } />
					<Repos repos={ this.state.repos } pulls={ this.state.pulls } />
				</main>
			</div>
		);
	}
}

export default App;
