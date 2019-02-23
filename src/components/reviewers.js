import React, { Component } from 'react';
import Section from './section';

export default class Reviewers extends Component {
	render() {
		let pulls = {},
			reviewers = [];

		Object.keys( this.props.pulls ).forEach( ( key ) => {
			this.props.pulls[ key ].forEach( pull => {
				pull.requested_reviewers.forEach( reviewer => {
					reviewers.push( reviewer.login );

					pulls[ reviewer.login ] = pulls[ reviewer.login ] || [];
					pulls[ reviewer.login ].push( pull );
				} );
			} );
		} );

		reviewers = reviewers.filter( (assignee, index, self ) => {
			return self.indexOf( assignee ) === index;
		});

		reviewers = reviewers.sort();

		const items = reviewers.map( assignee => {
			return {
				label: assignee,
				y: pulls[ assignee ].length,
			}
		} );

		return <Section title="Review Requests" items={ items } />
	}
}
