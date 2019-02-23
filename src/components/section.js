import React, { Component } from 'react';
import CanvasJSReact from '../lib/canvasjs.react';
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default class Section extends Component {
	render() {
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
					dataPoints: this.props.items
				}
			]
		}

		return (
			<section id={ this.props.title } className="section">
				<CanvasJSChart options={ options } />
			</section>
		);
	}
}
