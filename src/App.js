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
		//Bind onSelectMovie method
		this.onSelectMovie = this.onSelectMovie.bind(this);
		this.state =
		{
			//The movies the user has selected
			selectedMovies: [],
			//The recommendations the TMDB database returns for the above movies
			recommendations: [],
			//The originality score the app computes below
			result: ""
		}
	}

	//Send an API request for recommendations for each selected movie
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

	//Handles what happens when a movie is selected. Called in Search.js
	async onSelectMovie(movie)
	{
		//Check if this movie has been selected already
		if (!this.state.selectedMovies
			.map((selectedMovie) => { return selectedMovie.id }).includes(movie.id))
		{
			//If it hasn't been selected:
			//Request recommendations from API
			let recommendationsRequest = await this.sendApiRequest(movie);

			//Map the IDs of each recommendation to an array
			let recommendations = recommendationsRequest.data.results.map((movie) => {return movie.id});

			//Append selected movie and its recommendations to the app state
			this.setState( () =>
			{
				let movieList = [...this.state.selectedMovies, movie];
				let recommendationsList = [...this.state.recommendations, recommendations];
				return {selectedMovies: movieList, recommendations: recommendationsList}
			});
		}
	};

	//Handles movie deletion. Called by MovieList.js
	onDeleteMovie = (movieList, recommendationsList) =>
	{
		this.setState({selectedMovies: movieList, recommendations: recommendationsList});
	}

	//Render searchbar if the maximum capacity of MovieList has not been reached
	renderEnabledSearch()
	{
		return (
			<Search onSelectMovie={this.onSelectMovie} className="search leftColumn flexItem"/>
		)
	}

	//Render empty div if maximum capacity has been reached
	renderDisabledSearch()
	{
		return ( <div className="search leftColumn flexItem"></div> )
	}

	//Render submit button if minimum capacity of MovieList has been reached
	renderEnabledSubmit()
	{
		return (
			<input type="submit" value="Go!" className="submit" onClick={() => this.analyzeMovies()}></input>
		)
	}

	//Render empty span if minimum capacity has not been reached
	renderDisabledSubmit()
	{
		return (
			<span></span>
		)
	}

	//Analyzes the ratings, popularity, and recommendations of each movie in the MovieList.
	//Called by the submit button rendered by App.js
	analyzeMovies = () =>
	{
		//Map the ratings, popularity, and IDs of each movie to their own arrays
		let ratingsArray = this.state.selectedMovies.map( (movie) => movie.vote_average);
		let popularityArray = this.state.selectedMovies.map( (movie) => movie.popularity);
		let idArray = this.state.selectedMovies.map( (movie) => movie.id);
		let recommendationsArray = this.state.recommendations;

		//Assigns a score to each rating. The higher the score, the more unoriginal the movie.
		//See ratings.txt and research.html for more information on how these numbers were decided.
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

		//Add up the rating scores
		let ratingsScoresTotal = 0;
		for (let i = 0; i < ratingsScores.length; i++)
		{
			ratingsScoresTotal += ratingsScores[i];
		}

		//Assigns a score to each popularity. The higher the score, the more unoriginal the movie.
		//See popularity.txt and research.html for more information on how these numbers were decided.
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

		//Add up the popularity scores
		let popularityScoresTotal = 0;
		for (let i = 0; i < popularityScores.length; i++)
		{
			popularityScoresTotal += popularityScores[i];
		}

		//Assigns a score based on every movie's recommendations.
		//Each movie has a maximum of 20 recommendations. If a selected movie appears
		//in another selected movie's recommendations, the score is increased by 1.
		//A high score here roughly indicates a less varied taste.
		let recommendationsScore = 0;

		//Loop through the array of recommendations. Each object is itself an array of film recommendations.
		for (let i = 0; i < recommendationsArray.length; i++)
		{
			//Loop through the entries in each array.
			//Each object in this level is a single film recommendation.
			for (let j = 0; j < recommendationsArray[i].length; j++)
			{
				//Compare each selected movie to each recommendation in the recommendations array.
				for (let k = 0; k < idArray.length; k++)
				{
					//Increase the score by 1 for each match.
					if (idArray[k] === recommendationsArray[i][j])
					{
						recommendationsScore++;
					}
				}
			}
		}
		//Compute the final score. These numbers were determined by my judgment of
		//what contributed more to an original taste. Note that popularity has a smaller modifier
		//because TMDB's most popular movies tend to be very recent, regardless of how liked they are.
		let totalScore = ((0.5 * ratingsScoresTotal) + (0.25 * popularityScoresTotal) +
			(0.5 * recommendationsScore)) / idArray.length;

		//Return a text version of the final score. The cutoffs were again determined by
		//my judgment based on testing.
		let returnedScore;
		if (totalScore >= 8) returnedScore = "Very Unoriginal";
		else if (totalScore >= 6) returnedScore = "Somewhat Unoriginal";
		else if (totalScore >= 4) returnedScore = "Somewhat Original";
		else if (totalScore >= 3) returnedScore = "Very Original";
		else returnedScore = "Extremely Original";

		this.setState({result: returnedScore});
	}

	//When the result state is not empty, render a box stating the user's result.
	//Clicking on the close icon in the corner will reset the result state to an empty string.
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
