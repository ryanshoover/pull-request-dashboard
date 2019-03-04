import React, { Component } from 'react';
import Chart from 'chart.js';
import { colors } from '../config';

export default class Section extends Component {

	constructor() {
		super();
		this.chartID =  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
	}

	componentDidUpdate() {
		new Chart(
			this.chartID,
			{
				type: 'horizontalBar',
				data: {
					labels: Object.keys( this.props.data ),
					datasets: [
						{
							label: this.props.title,
							data: Object.values( this.props.data ),
							backgroundColor: colors,
						},
					]
				},
				options: {
					title: {
						display: true,
						fontSize: 32,
						text: this.props.title,
					},
					scaleShowGridLines: false,
					barShowStroke: false,
					legend: {
						display: false,
					},
					scales: {
						xAxes: [ {
							gridLines: {
								display: false,
							},
							ticks: {
								beginAtZero: true,
								stepSize: 1,
							},
							scaleLabel: {
								fontSize: 18,
							},
						} ],
						yAxes: [ {
							gridLines: {
								display: false,
							},
							scaleLabel: {
								display: true,
								fontSize: 18,
							},
						} ],
					},
				},
			}
		);
	}

	render() {
		return (
			<section id={ this.props.title } className="section">
				<canvas id={ this.chartID }></canvas>
			</section>
		);
	}
}
