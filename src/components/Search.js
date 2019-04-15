import React, { Component } from 'react';
import axios from 'axios';
import MoviePanel from './MoviePanel.js';


class Search extends Component
{
	constructor(props)
	{
		super(props);
		this.state =
		{
			value: "",
			suggestions: []
		};
	}

	renderNoSuggestions = () =>
	{
		return (
			<input autoFocus value={this.state.value} type="search" placeholder="Start typing a movie title..." onChange={(val) => this.handleChange(val)}></input>
		)
	}

	renderSuggestions = () =>
	{
		const suggestions = this.state.suggestions.map((suggestion) =>
		{
			return ( <MoviePanel movie={suggestion} key={suggestion.id} removable={false} onClick={() =>
				{
					this.props.onSelectMovie(suggestion);

					this.setState(
						{ 
							value: "",
							suggestions: []
						})
				}}/> );

		});
		return (
			<div>
				<input autoFocus value={this.state.value} type="search" placeholder="Start typing a movie title..." onChange={(val) => this.handleChange(val)}></input>
				<div className="suggestions">{suggestions}</div>
			</div>
		);
	}

	async handleChange(val)
	{
		this.setState(
			{
				value: val.target.value
			});

		if (val.target.value)
		{
			let tmdbJson = await this.sendApiRequest(val.target.value);

			let tmdbResults = tmdbJson.data.results;

			this.setState({ suggestions: tmdbResults });
		}
		else
		{
			this.setState(
			{
				suggestions: []
			});
		}
	}

	async sendApiRequest(val)
	{
		const tmdbRequest = await axios.get("https://api.themoviedb.org/3/search/movie",
			{
				params:
					{ 
						api_key: process.env.REACT_APP_API_KEY,
						query: val
					}
			})

		return tmdbRequest;
	}

	render()
	{
		return (
			<section className="search">
				{ this.state.suggestions.length ? this.renderSuggestions() : this.renderNoSuggestions() }
			</section>
		)
	}
}

export default Search;