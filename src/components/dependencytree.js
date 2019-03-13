import React, { Component } from 'react';
import Chart from 'chart.js';
import { colors } from '../config';

export default class DependencyTree extends Component {

	constructor() {
		super();

		this.categories = [
			'wpengine',
			'studiopress',
			'wpackagist-plugin',
			'wpackagist-muplugin',
			'wpackagist-theme',
			'beaver-builder',
			'wpmudev',
		];
	}

	componentDidUpdate() {
		const datasets = this.calcDataSets();

		new Chart(
			this.canvas.getContext( '2d' ),
			{
				type: 'radar',
				data: {
					labels: this.categories,
					datasets: datasets,
				},
				options: {
					title: {
						display: true,
						fontSize: 32,
						text: this.props.title,
					},
				},
			}
		);
	}

	calcDataSets() {
		const datasets = [];
		console.log( this.props.data );

		if ( ! this.props.data || ! this.props.data.length ) {
			return datasets;
		}

		this.props.data.forEach( data => {
			const values = [];

			this.categories.forEach( category => {
				values.push( data.hasOwnProperty( category ) ? data[ category ].length : 0 ) ;
			} );

			datasets.push(
				{
					label: data.name,
					data: values,
					backgroundColor: colors,
				}
			);
		} );

		return datasets;
	}

	render() {
		return (
			<canvas ref={ canvas => this.canvas = canvas } className="depedencytree" />
		);
	}
}
