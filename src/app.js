import React, { Component } from 'react';
import { Section } from './components';
import './app.css';

class App extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			pulls: {
				reviewers: {},
				owners: {},
				repos: {},
			},
		};

		this.INTERVAL = 60000;

		this.updatePullData.bind( this );
		this.setState.bind( this );
	}

	componentDidMount() {
		this.updatePullData();

		this.intervalID = setInterval( () => this.updatePullData(), this.INTERVAL );
	}

	updatePullData() {
		fetch( '/pulls' )
			.then( res => {
				if ( 200 !== res.status ) {
					throw new Error( res.statusText );
				}

				return res.json();
			} )
			.then( data => {
				console.log( data );
				this.setState( { pulls: data } );
			} )
			.catch( err => console.error( err ) );
	}

	render() {
		return (
			<div className="app">
				<header className="app-header">
					<h1>Pull Requests</h1>
				</header>
				<main className="app-main">
					<Section title="Review Requests" data={ this.state.pulls.reviewers } />
					<Section title="Open Pulls" data={ this.state.pulls.owners } />
					<Section title="Repos" data={ this.state.pulls.repos } />
				</main>
			</div>
		);
	}
}

export default App;
