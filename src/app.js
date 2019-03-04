import React, { Component } from 'react';
import { BarGraph, DependencyTree } from './components';
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
		this.updateProductData();

		this.intervalID = setInterval( () => this.updatePullData(), this.INTERVAL );
	}

	updatePullData() {
		fetch( '/api/pulls' )
			.then( res => {
				if ( 200 !== res.status ) {
					throw new Error( res.statusText );
				}

				return res.json();
			} )
			.then( data => {
				this.setState( { pulls: data } );
			} )
			.catch( err => console.error( err ) );
	}

	updateProductData() {
		fetch( '/api/products' )
			.then( res => {
				if ( 200 !== res.status ) {
					throw new Error( res.statusText );
				}

				return res.json();
			} )
			.then( data => {
				this.setState( { products: data } );
			} )
			.catch( err => console.error( err ) );
	}

	render() {
		return (
			<div className="app">
				<header className="app-header">
					<h1>Pull Requests</h1>
				</header>
				<main className="pulls">
					<BarGraph title="Review Requests" data={ this.state.pulls.reviewers } />
					<BarGraph title="Open Pulls" data={ this.state.pulls.owners } />
					<BarGraph title="Repos" data={ this.state.pulls.repos } />
				</main>
				<main className="products">
					<DependencyTree title="Products" data={ this.state.products } />
				</main>
			</div>
		);
	}
}

export default App;
