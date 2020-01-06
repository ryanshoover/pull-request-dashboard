import React, { Component } from 'react';
import Chart from 'chart.js';
import { colors } from '../config';

export default class BarGraph extends Component {

	componentDidUpdate() {
		new Chart(
			this.canvas.getContext( '2d' ),
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
								fontSize: 24,
								beginAtZero: true,
								stepSize: 1,
							},
						} ],
						yAxes: [ {
							gridLines: {
								display: false,
							},
							ticks: {
								fontSize: 36,
							}
						} ],
					},
				},
			}
		);
	}

	render() {
		return (
			<section className="bargraph">
				<canvas ref={ canvas => this.canvas = canvas } />
			</section>
		);
	}
}
