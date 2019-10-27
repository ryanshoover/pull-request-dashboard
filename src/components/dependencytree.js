import React, { Component } from 'react';

export default class DependencyTree extends Component {

	constructor() {
		super();

		this.state = {
			repo: '',
			package: '',
		};

		this.onRepoChange = this.onRepoChange.bind( this );
	}

	onRepoChange( event ) {
		this.setState( {
			repo: event.target.value,
		} );
	}

	render() {
		const optionsRepo = [];

		for ( const repo of this.props.dependencies ) {
			optionsRepo.push( (
				<option value={ repo.name } selected={ this.state.repo === repo.name } key={ repo.name }>
					{ repo.name }
				</option>
			) );
		}

		const repo = this.props.dependencies.find( dependency => dependency.name === this.state.repo );
		const composerItems = [];
		const packageItems = [];

		if ( repo ) {
			for ( const composer of repo.composer ) {
				composerItems.push( ( <li key={ composer }>{ composer }</li> ) );
			}

			for ( const packg of repo.package ) {
				packageItems.push( ( <li key={ packg }>{ packg }</li> ) );
			}
		}

		return (
			<>
				<label htmlFor="repo">Choose a repo to see its dependencies</label>
				<select onChange={ this.onRepoChange } id="repo">
					{ optionsRepo }
				</select>
				<h2>{ this.state.repo || 'Select a repo' }</h2>
				<h3>Composer</h3>
				<ul>{ composerItems }</ul>
				<h3>Package</h3>
				<ul>{ packageItems }</ul>
			</>

		);
	}
}
