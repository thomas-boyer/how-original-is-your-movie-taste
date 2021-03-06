# How Original Is Your Movie Taste?

This tongue-in-cheek React SPA evaluates your movie taste.

## How It Works

The application searches the TMDB API for movies inputted by the user. It then uses each movie's rating, popularity score, and recommendations to evaluate the originality of the user's movie taste. **Note that this evaluation is influenced by many biases, most notably my own.**

## Set it up!

- Clone the repository: `git clone git@github.com:thomas-boyer/how-original-is-your-movie-taste.git`
- Navigate to the project folder.
- Create a new `.env` file. Copy the contents of `.env.example` to this file.
- Replace the value of `REACT_APP_API_KEY` in `.env` with your TMDB API key. This key can be generated by creating a TMDB account and navigating to the API section of your account settings.
- Install the project's dependencies: `npm i`
- Run the project with `npm start`

## Major Dependencies

- React
- Axios
- downshift
- @material-ui/core
- @material-ui/icons