import React, { Component } from 'react';
import MoviePanel from './MoviePanel.js';

class MovieList extends Component
{
	constructor(props)
	{
		super(props);
		this.state =
		{
			//The movies in the MovieList.
			movies: [],
			//The recommendations the API returns for each movie.
			//Used here to modify the App state when a movie is deleted from the MovieList.
			recommendations: []
		};
	}

	renderMovies()
	{
		//Render a MoviePanel object for each movie in the MovieList's state.
		const movieList = this.state.movies.map((movie) =>
		{
			return ( <MoviePanel movie={movie} movieList={this.props.movies} key={movie.id} removable={true} dupesAllowed={false} removeMovie={this.removeMovie}/> )
		});
		return (
			<div className="movieList">{movieList}</div>
		);
	}

	//Removes a movie if the remove icon in the corner of the panel is clicked.
	removeMovie = (movie) =>
	{
		//Copy the MovieList state to arrays
		let movies = this.state.movies;
		let recommendations = this.state.recommendations;

		//Get the index of the movie to be deleted and remove that index from both arrays.
		let targetIndex = movies.indexOf(movie);
		movies.splice(targetIndex, 1);
		recommendations.splice(targetIndex, 1);

		//Update the states of the MovieList and App.js
		this.setState({movies: movies, recommendations: recommendations});
		this.props.onDeleteMovie(this.state.movies, this.state.recommendations);
	}

	//Updates the MovieList state if the App.js state has updated; for instance, if a
	//movie was selected from the search component.
	componentDidUpdate(prevProps, prevState)
	{
		if (this.props.movies !== prevProps.movies)
		{
			this.setState({movies: this.props.movies, recommendations: this.props.recommendations});
		};
	}

	render()
	{
		return (
			<section className="movieList">
				{this.renderMovies()}
			</section>
		)
	}
}

export default MovieList;