import React, { Component } from 'react';
import Header from './components/Header.js';
import Search from './components/Search.js';
import MovieList from './components/MovieList.js';
import Footer from './components/Footer.js';
import ResultBox from './components/ResultBox.js';
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
			recs: [],
			//The originality score the app computes below
			result: ""
		}
	}

	//Send an API request for recs for each selected movie
	async getRecs(movie)
	{
		const recRequest = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/recommendations`,
		{
			params:
				{
					api_key: process.env.REACT_APP_API_KEY
				}
		});
		return recRequest;
	}

	//Handles what happens when a movie is selected. Called in Search.js
	async onSelectMovie(movie)
	{
		//Check if this movie has been selected already
		if (!this.state.selectedMovies
			.map((selectedMovie) => { return selectedMovie.id })
			.includes(movie.id))
		{
			//If it hasn't been selected:
			//Request recs from API
			console.log(movie);
			const recRequest = await this.getRecs(movie);

			//Map the IDs of each recommendation to an array
			const recs = recRequest.data.results.map((movie) =>
				{ return movie.id });

			//Append selected movie and its recs to the app state
			this.setState( () => {
				return {
					selectedMovies: [...this.state.selectedMovies, movie],
					recs: this.state.recs.concat(recs)
				}
			});
			console.log(this.state.recs);
		}
	};

	//Handles movie deletion. Called by MovieList.js
	onDeleteMovie = (movieList, recList) =>
	{
		this.setState({ selectedMovies: movieList, recs: recList });
	}

	//Analyzes the ratings, popularity, and recs of each movie in the MovieList.
	//Called by the submit button rendered by App.js
	analyzeMovies = () =>
	{
		//Map the ratings, popularity, and IDs of each movie to their own arrays
		const ratingsArray = this.state.selectedMovies.map( (movie) => movie.vote_average);
		const popularityArray = this.state.selectedMovies.map( (movie) => movie.popularity);

		//Assigns a score to each rating. The higher the score, the more unoriginal the movie.
		//See ratings.txt and research.html for more information on how these numbers were decided.
		const ratingsScore = ratingsArray.map( (rating) => {
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
			}).reduce( (accumulator, current) => accumulator + current);

		//Assigns a score to each popularity. The higher the score, the more unoriginal the movie.
		//See popularity.txt and research.html for more information on how these numbers were decided.
		const popularityScore = popularityArray.map( (popularity) => {
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
			}).reduce( (accumulator, current) => accumulator + current);

		//Assigns a score based on every movie's recs.
		//Each movie has a maximum of 20 recs. If a selected movie appears
		//in another selected movie's recs, the score is increased by 1.
		//A high score here roughly indicates a less varied taste.
		let recsScore = 0;

		//An object with the IDs of each selected movie as keys.
		//Used to make determining the recommendation score more efficient.
		const idObj = {};
		for (let movieID of this.state.selectedMovies.map( (movie) => movie.id)) {
			idObj[movieID] = true;
		}

		//Loop through the array of recs.
		for (let rec of this.state.recs) {
			//Increase the score by 1 for each recommendation that matches a selected movie.
			if (idObj[rec.id]) {
				recsScore++;
			}
		}

		//Compute the final score. These numbers were determined by my judgment of
		//what contributed more to an original taste. Note that popularity has a smaller modifier
		//because TMDB's most popular movies tend to be very recent, regardless of how liked they are.
		let totalScore = ((0.5 * ratingsScore) + (0.25 * popularityScore) +
			(0.5 * recsScore)) / ratingsArray.length;

		//Return a text version of the final score. The cutoffs were again determined by
		//my judgment based on testing.
		let textScore;
		if (totalScore >= 8) textScore = "Very Unoriginal";
		else if (totalScore >= 6) textScore = "Somewhat Unoriginal";
		else if (totalScore >= 4) textScore = "Somewhat Original";
		else if (totalScore >= 3) textScore = "Very Original";
		else textScore = "Extremely Original";

		this.setState({ result: textScore });
	}

	render() {
		return (
			<div className="App">
				<Header />
				<Footer />
				<main>
					{ this.state.selectedMovies.length < 10 ?
						   <Search onSelectMovie={ this.onSelectMovie }
							 				 className="search leftColumn flexItem"/> :

								  <div className="search leftColumn flexItem"/>  }

					<div className="rightColumn">

						{ this.state.selectedMovies.length >= 5 ?
							  <input type="submit"
											 value="Go!"
											 className="submit"
											 onClick={ () => this.analyzeMovies() }></input> : null  }

						<MovieList movies={ this.state.selectedMovies }
											 recs={ this.state.recs }
											 onDeleteMovie={ this.onDeleteMovie }/>

					</div>
				</main>

				{ this.state.result &&
					( <ResultBox result={ this.state.result }
									 	   clearResult={ () => this.setState({ result: "" }) }/> ) }

			</div>
		);
	}
}

export default App;
