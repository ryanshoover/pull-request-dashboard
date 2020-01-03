import React, { Component } from 'react';

export default class DependencyTree extends Component {

	constructor() {
		super();

		this.state = {
			repo: '',
			package: '',
		};

		this.onRepoChange = this.onRepoChange.bind( this );
		this.onPackageChange = this.onPackageChange.bind( this );
	}

	onRepoChange( event ) {
		this.setState( {
			repo: event.target.value,
			package: '',
		} );
	}

	onPackageChange( event ) {
		this.setState( {
			package: event.target.value,
			repo: '',
		} );
	}

	render() {
		const optionsRepo = [];
		const optionsPackages = [];
		const repo = this.props.dependencies.find( dependency => dependency.name === this.state.repo );
		const composerItems = [];
		const packageItems = [];
		const repoItems = [];

		let composerDeps = [];
		let packageDeps = [];

		for ( const repo of this.props.dependencies ) {
			optionsRepo.push( (
				<option value={ repo.name } key={ repo.name }>
					{ repo.name }
				</option>
			) );

			composerDeps = [ ...composerDeps, ...repo.composer ];
			packageDeps = [ ...packageDeps, ...repo.package ];
		}

		composerDeps.sort();
		packageDeps.sort();
		const packgs = new Set( [ ...composerDeps, ...packageDeps ] );

		for ( const packg of packgs.values() ) {
			optionsPackages.push( (
				<option value={ packg } key={ packg }>
					{ packg }
				</option>
			) );
		}

		if ( repo ) {
			for ( const composer of repo.composer ) {
				composerItems.push( ( <li key={ composer }>{ composer }</li> ) );
			}

			for ( const packg of repo.package ) {
				packageItems.push( ( <li key={ packg }>{ packg }</li> ) );
			}
		}

		if ( this.state.package ) {
			for ( const repo of this.props.dependencies ) {
				if ( repo.composer.includes( this.state.package ) || repo.package.includes( this.state.package ) ) {
					repoItems.push( ( <li key={ repo.name }>{ repo.name }</li> ) );
				}
			}
		}

		return (
			<>
				<div className="form">
					<h2>{ this.state.repo || this.state.package || 'Select a repo' }</h2>
					<p>
						<label htmlFor="repo">Choose a repo to see its dependencies</label>
						<select value={ this.state.repo } onChange={ this.onRepoChange } id="repo">
							{ optionsRepo }
						</select>
					</p>
					<p>
						<label htmlFor="repo">Choose a package to see repos that use it</label>
						<select value={ this.state.package } onChange={ this.onPackageChange } id="package">
							{ optionsPackages }
						</select>
					</p>
				</div>
				{ this.state.repo &&
					<div className="results">
						<div className="dependencies">
							<h3>Composer</h3>
							<ul>{ composerItems }</ul>
						</div>
						<div className="dependencies">
							<h3>Package</h3>
							<ul>{ packageItems }</ul>
						</div>
					</div>
				}
				{ this.state.package &&
					<div className="dependencies">
						<h3>Repositories</h3>
						<ul>{ repoItems }</ul>
					</div>
				}
			</>

		);
	}
}
