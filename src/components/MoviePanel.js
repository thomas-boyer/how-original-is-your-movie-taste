import React, { Component } from 'react';
import Close from '@material-ui/icons/Close';

class MoviePanel extends Component
{
	constructor(props)
	{
		super(props);
		this.state = {};
	}

	//Renders the button which closes the MoviePanel. The onClick props calls the removeMovie
	//method in MovieList.js.
	renderRemoveButton()
	{
		return (
			<Close className="close" onClick={() => this.props.removeMovie(this.props.movie)}/>
		)
	}

	render()
	{
		//Sets the image in the MoviePanel. The image is taken from the movie JSON object
		//passed to MoviePanel by both MovieList and Search. Each poster has a minimum 200px wide
		//size hosted by TMDB, which this links to. If TMDB returns no poster path, render an empty
		//div instead.
		let image = (this.props.movie.poster_path ? 
					<div><img alt={`Poster for ${this.props.movie.original_title}`}
						src={`https://image.tmdb.org/t/p/w200/${this.props.movie.poster_path}`} /></div> :
					<div className="imagePlaceholder"></div>);
		//The onClick prop below calls the onClick prop in Search.js, which is eventually passed to App.js.
		//If the moviePanel can be removable (ie, it is a MovieList panel), render a remove button.
		return (
			<div key={this.props.movie.id} className="moviePanel flexContainer" tabIndex="0" onClick={this.props.onClick}>
						{image}
						<div className="details">
							<p>{this.props.movie.original_title}</p>
							<p>{this.props.movie.release_date.slice(0,4)}</p>
						</div>
						{this.props.removable ? this.renderRemoveButton() : <span></span> }
			</div>
		)
	}
}

export default MoviePanel;