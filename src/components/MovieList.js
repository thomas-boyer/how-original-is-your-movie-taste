import React, { Component } from 'react';
import MoviePanel from './MoviePanel.js';

class MovieList extends Component
{
	constructor(props)
	{
		super(props);
		this.state =
		{
			movies: [],
			recommendations: []
		};
	}

	renderMovies()
	{
		const movieList = this.state.movies.map((movie) =>
		{
			return ( <MoviePanel movie={movie} movieList={this.props.movies} key={movie.id} removable={true} dupesAllowed={false} removeMovie={this.removeMovie}/> )
		});
		return (
			<div className="movieList">{movieList}</div>
		);
	}

	removeMovie = (movie) =>
	{
		let movies = this.state.movies;
		let recommendations = this.state.recommendations;

		let targetIndex = movies.indexOf(movie);
		movies.splice(targetIndex, 1);
		recommendations.splice(targetIndex, 1);

		this.setState({movies: movies, recommendations: recommendations});
		this.props.onDeleteMovie(this.state.movies, this.state.recommendations);
	}

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