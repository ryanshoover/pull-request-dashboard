import React, { Component } from 'react';
import Section from './section';

export default class Repos extends Component {
	render() {
		let counts = {};

		this.props.pulls.forEach( ( pull ) => {
			const repo = pull.url.match( /\/repos\/[^/]+\/([^/]+)\// );
			console.log( pull.url );
			counts[ repo[1] ] = counts[ repo[1] ] || 0;
			counts[ repo[1] ]++;
		} );

		let repos = Object.keys( counts ).sort();

		const items = repos.map( repo => {
			return {
				label: repo,
				y: counts[ repo ],
			}
		} );

		return <Section title="Repos" items={ items } />
	}
}
