import React, { Component } from 'react';
import CanvasJSReact from '../lib/canvasjs.react';
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default class Section extends Component {
	render() {
		const labels = Object.keys( this.props.data ).sort();

		const items = labels.map( label => {
			return {
				label: label,
				y: this.props.data[ label ],
			}
		} );

		const options = {
			animationEnabled: true,
			title: {
				text: this.props.title
			},
			axisX: {
				reversed: true,
			},
			axisY: {
				interval: 1,
				gridThickness: 0,
			},
			data: [
				{
					type: "bar",
					dataPoints: items
				}
			]
		};

		return (
			<section id={ this.props.title } className="section">
				<CanvasJSChart options={ options } />
			</section>
		);
	}
}
