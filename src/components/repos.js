import React, { Component } from 'react';
import Section from './section';

export default class Repos extends Component {
	render() {
		const repos = this.props.repos.filter( repo => {
			return this.props.pulls[ repo.node_id ] && this.props.pulls[ repo.node_id ].length
		} );

		const items = repos.map( repo => {
			return {
				label: repo.name,
				y: this.props.pulls[ repo.node_id ].length,
			}
		} );

		return <Section title="Repos" items={ items } />
	}
}
