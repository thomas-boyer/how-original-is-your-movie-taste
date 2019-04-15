import React, { Component } from 'react';
import Close from '@material-ui/icons/Close';

class MoviePanel extends Component
{
	constructor(props)
	{
		super(props);
		this.state = {};
	}

	renderRemoveButton()
	{
		return (
			<Close className="close" onClick={() => this.props.removeMovie(this.props.movie)}/>
		)
	}

	render()
	{
		let image = (this.props.movie.poster_path ? 
					<div><img alt={`Poster for ${this.props.movie.original_title}`}
						src={`https://image.tmdb.org/t/p/w200/${this.props.movie.poster_path}`} /></div> :
					<div className="imagePlaceholder"></div>);
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