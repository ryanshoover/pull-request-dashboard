import React, { Component } from 'react';
import Pulls from './components/pulls';
import './app.css';

class App extends Component {
	render() {
		return (
			<div className="app">
				<header className="app-header">
					<h1>Pull Request Dashboard</h1>
				</header>
				<article>
					<Pulls />
				</article>
			</div>
		);
	}
}

export default App;
