import React, { Component } from 'react';
import Header from './components/Header.js';
import Search from './components/Search.js';
import MovieList from './components/MovieList.js';
import Close from '@material-ui/icons/Close';
import Footer from './components/Footer.js';
import axios from 'axios';
import './styles/App.css';

class App extends Component {

	constructor(props)
	{
		super(props);
		this.onSelectMovie = this.onSelectMovie.bind(this);
		this.state =
		{
			selectedMovies: [],
			recommendations: [],
			result: ""
		}
	}

	async sendApiRequest(movie)
	{
		const recommendationsRequest = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/recommendations`,
		{
			params:
				{ 
					api_key: process.env.REACT_APP_API_KEY
				}
		});
		return recommendationsRequest;
	}

	async onSelectMovie(movie)
	{
		if (!this.state.selectedMovies
			.map((selectedMovie) => { return selectedMovie.id }).includes(movie.id))
		{
			let recommendationsRequest = await this.sendApiRequest(movie);

			let recommendations = recommendationsRequest.data.results.map((movie) => {return movie.id});

			this.setState( () =>
			{
				let movieList = [...this.state.selectedMovies, movie];
				let recommendationsList = [...this.state.recommendations, recommendations];
				return {selectedMovies: movieList, recommendations: recommendationsList}
			});
		}
	};

	onDeleteMovie = (movieList, recommendationsList) =>
	{
		this.setState({selectedMovies: movieList, recommendations: recommendationsList});
		this.renderEnabledSearch();
	}

	renderEnabledSearch()
	{
		return (
			<Search onSelectMovie={this.onSelectMovie} className="search leftColumn flexItem"/>
		)
	}

	renderDisabledSearch()
	{
		return ( <div className="search leftColumn flexItem"></div> )
	}

	renderEnabledSubmit()
	{
		return (
			<input type="submit" value="Go!" className="submit" onClick={() => this.analyzeMovies()}></input>
		)
	}

	renderDisabledSubmit()
	{
		return (
			<span></span>
		)
	}

	analyzeMovies = () =>
	{
		let ratingsArray = this.state.selectedMovies.map( (movie) => movie.vote_average);
		let popularityArray = this.state.selectedMovies.map( (movie) => movie.popularity);
		let idArray = this.state.selectedMovies.map( (movie) => movie.id);
		let recommendationsArray = this.state.recommendations;

		let ratingsScores = ratingsArray.map( (rating) =>
			{
				if (rating >= 8) return 10;
				else if (rating >= 7.5) return 9;
				else if (rating >= 7) return 8;
				else if (rating >= 6.5) return 7;
				else if (rating >= 6) return 6;
				else if (rating >= 5.5) return 5;
				else if (rating >= 5) return 4;
				else if (rating >= 4.5) return 3;
				else if (rating >= 4) return 2;
				else if (rating >= 3.5) return 1;
				else return 0;
			});

		let ratingsScoresTotal = 0;
		for (let i = 0; i < ratingsScores.length; i++)
		{
			ratingsScoresTotal += ratingsScores[i];
		}
		
		let popularityScores = popularityArray.map( (popularity) =>
			{
				if (popularity >= 21.3) return 10;
				else if (popularity >= 16.6) return 9;
				else if (popularity >= 13.35) return 8;
				else if (popularity >= 11.75) return 7;
				else if (popularity >= 10.1) return 6;
				else if (popularity >= 8.9) return 5;
				else if (popularity >= 7.85) return 4;
				else if (popularity >= 7.05) return 3;
				else if (popularity >= 6.35) return 2;
				else if (popularity >= 5.85) return 1;
				else return 0;
			});

		let popularityScoresTotal = 0;
		for (let i = 0; i < popularityScores.length; i++)
		{
			popularityScoresTotal += popularityScores[i];
		}
		
		let recommendationsScore = 0;
		for (let i = 0; i < recommendationsArray.length; i++)
		{
			for (let j = 0; j < recommendationsArray[i].length; j++)
			{
				for (let k = 0; k < idArray.length; k++)
				{
					if (idArray[k] === recommendationsArray[i][j])
					{
						recommendationsScore++;
					}
				}
			}
		}

		let totalScore = ((0.4 * ratingsScoresTotal) + (0.25 * popularityScoresTotal) + 
			(0.6 * recommendationsScore)) / idArray.length;
		
		let returnedScore;
		if (totalScore >= 8) returnedScore = "Very Unoriginal";
		else if (totalScore >= 6) returnedScore = "Somewhat Unoriginal";
		else if (totalScore >= 4) returnedScore = "Somewhat Original";
		else if (totalScore >= 3) returnedScore = "Very Original";
		else returnedScore = "Extremely Original";

		this.setState({result: returnedScore});
	}

	renderResultBox()
	{
		return (
			<div className="resultBackground">
				<div className="resultBox">
					<p className="resultHeader">Your movie taste is...</p>
					<p className="result">{this.state.result}!</p>
					<Close className="close" onClick={() => this.setState({ result: "" })}/>
				</div>
			</div>
		)
	}

	render() {
		return (
			<div className="App">
				<Header />
				<Footer />
				<main>
					{ this.state.selectedMovies.length < 10 ? this.renderEnabledSearch() : this.renderDisabledSearch() }
					<div className="rightColumn">
						{ this.state.selectedMovies.length >= 5 ? this.renderEnabledSubmit() : this.renderDisabledSubmit() }
						<MovieList movies={this.state.selectedMovies} recommendations={this.state.recommendations} onDeleteMovie={this.onDeleteMovie}/>	
					</div>
				</main>
				{ this.state.result ? this.renderResultBox() : <span></span> }
			</div>
		);
	}
}

export default App;
