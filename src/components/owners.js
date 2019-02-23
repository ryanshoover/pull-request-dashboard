import React, { Component } from 'react';
import Section from './section';

export default class Owners extends Component {
	render() {
		let counts = {};

		this.props.pulls.forEach( ( pull ) => {
			const owner = pull.assignee || pull.user;

			counts[ owner.login ] = counts[ owner.login ] || 0;
			counts[ owner.login ]++;
		} );

		let owners = Object.keys( counts ).sort();

		const items = owners.map( owner => {
			return {
				label: owner,
				y: counts[ owner ],
			}
		} );

		return <Section title="Open Pulls" items={ items } />
	}
}
