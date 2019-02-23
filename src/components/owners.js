import React, { Component } from 'react';
import Section from './section';

export default class Owners extends Component {
	render() {
		let pulls = {},
			owners = [];

		Object.keys( this.props.pulls ).forEach( ( key ) => {
			this.props.pulls[ key ].forEach( pull => {
				const owner = pull.assignee || pull.user;

				owners.push( owner.login );

				pulls[ owner.login ] = pulls[ owner.login ] || [];
				pulls[ owner.login ].push( pull );
			} );
		} );

		owners = owners.filter( (owner, index, self ) => {
			return self.indexOf( owner ) === index;
		});

		owners = owners.sort();

		const items = owners.map( owner => {
			return {
				label: owner,
				y: pulls[ owner ].length,
			}
		} );

		return <Section title="Open Pulls" items={ items } />
	}
}
