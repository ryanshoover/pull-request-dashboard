import React, { Component } from 'react';
import { Reviewers, Owners, Repos } from './components';
import './app.css';

class App extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			pulls: [],
		};
	}

	componentDidMount() {
		this.updatePullData();

		setInterval( this.updatePullData, 60000 );
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
