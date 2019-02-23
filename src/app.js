import React, { Component } from 'react';
import { Reviewers, Owners, Repos } from './components';
import './app.css';

class App extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			pulls: [],
		};

		this.INTERVAL = 6000;

		this.updatePullData.bind( this );
		this.setState.bind( this );
	}

	componentDidMount() {
		this.updatePullData();

		this.intervalID = setInterval( () => this.updatePullData(), this.INTERVAL );
	}

	updatePullData() {
		fetch( '/pulls' )
			.then( res => res.json() )
			.then( data => {
				this.setState( { pulls: data } );
			} );
	}

	render() {
		return (
			<div className="app">
				<header className="app-header">
					<h1>Pull Requests</h1>
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
