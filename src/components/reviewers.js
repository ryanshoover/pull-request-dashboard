import React, { Component } from 'react';
import Section from './section';

export default class Reviewers extends Component {
	render() {
		let counts = {};

		this.props.pulls.forEach( ( pull ) => {
			pull.requested_reviewers.forEach( reviewer => {
				counts[ reviewer.login ] = counts[ reviewer.login ] || 0;
				counts[ reviewer.login]++;
			} );
		} );

		let reviewers = Object.keys( counts ).sort();

		const items = reviewers.map( reviewer => {
			return {
				label: reviewer,
				y: counts[ reviewer ],
			}
		} );

		return <Section title="Review Requests" items={ items } />
	}
}
