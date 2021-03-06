import React, { Component } from 'react';
import { BarGraph, DependencyTree } from './components';
import './app.css';

class App extends Component {
	constructor( props ) {
		super( props );

		this.props = props;

		this.state = {
			pulls: {
				reviewers: {},
				owners: {},
				repos: {},
			},
			dependencies: [],
		};

		this.INTERVAL = 60000 * 5; // 5 minutes

		this.updateData = this.updateData.bind( this );
		this.setState.bind( this );
	}

	componentDidMount() {
		for ( const type of [ 'pulls', 'dependencies' ] ) {
			this.updateData( type );
		}

		this.intervalID = setInterval( () => this.updateData( 'pulls' ), this.INTERVAL );
	}

	updateData( type ) {
		fetch( `/api/${ type }` )
			.then( res => {
				if ( 200 !== res.status ) {
					throw new Error( res.statusText );
				}

				return res.json();
			} )
			.then( data => {
				const state = this.state;

				state[ type ] = data;

				this.setState( state );
			} )
			.catch( err => console.error( err ) );
	}

	render() {
		return (
			<div className="app">
				<header className="app-header">
					<h1>{ this.props.title }</h1>
				</header>
				<main className="pulls">
					<BarGraph title="Review Requests" data={ this.state.pulls.reviewers } />
					<BarGraph title="Open Pulls" data={ this.state.pulls.owners } />
					<BarGraph title="Repos" data={ this.state.pulls.repos } />
				</main>
				<header className="app-header">
					<h1>Repos &amp; Dependencies</h1>
				</header>
				<main className="products">
					<DependencyTree title="Products" dependencies={ this.state.dependencies } />
				</main>
			</div>
		);
	}
}

export default App;
