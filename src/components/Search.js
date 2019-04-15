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
			//The value in the searchbar.
			//This is kept in state to prevent the searchbar value from disappearing
			//when changing between noSuggestions and Suggestions.
			value: "",
			//The search suggestions returned from the API.
			suggestions: []
		};
	}

	//Render no suggestions if the searchbar is empty or the API returns no suggestions.
	renderNoSuggestions = () =>
	{
		return (
			<input autoFocus value={this.state.value} type="search" placeholder="Start typing a movie title..." onChange={(val) => this.handleChange(val)}></input>
		)
	}

	//Render the suggestions returned by the API.
	renderSuggestions = () =>
	{
		//Map each suggestion to a MoviePanel object.
		const suggestions = this.state.suggestions.map((suggestion) =>
		{
			return ( <MoviePanel movie={suggestion} key={suggestion.id} removable={false} onClick={() =>
				{
					//When the suggestion is selected, update the App.js selectMovie state and the Search state.
					this.props.onSelectMovie(suggestion);

					this.setState(
						{ 
							value: "",
							suggestions: []
						})
				}}/> );

		});
		//The onChange prop below calls the handleChange function whenever the search value changes (ie, whenever something is typed in/deleted from the search bar)
		return (
			<div>
				<input autoFocus value={this.state.value} type="search" placeholder="Start typing a movie title..." onChange={(val) => this.handleChange(val)}></input>
				<div className="suggestions">{suggestions}</div>
			</div>
		);
	}

	//When the searchbar value changes, update the value state and send an API request for suggestions.
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
		//Clear suggestions if the searchbar is empty.
		else
		{
			this.setState(
			{
				suggestions: []
			});
		}
	}

	//Request search suggestions from the API.
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