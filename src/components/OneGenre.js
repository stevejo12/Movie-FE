import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'

export default class OneGenre extends Component {
  state = {
    movies: [],
    isLoaded: false,
    error: null,
    genreName: "",
  }

  componentDidMount() {
    fetch("http://localhost:4000/v1/movies/" + this.props.match.params.id)
      // .then((response) => response.json())
      .then((response) => {
        console.log("Status code is", response.status);

        if (response.status !== "200") {
          let err = Error;
          err.message = "Invalid response code: " + response.status;
          this.setState({error: err});
        }

        return response.json();
      })
      .then((json) => {
        this.setState({
          movies: json.movies || [],
          isLoaded: true,
          genreName: this.props.location.genreName
        },
        // the use of this is
        // make sure there is error message
        // when there is an error in the component / network error
        // catch block might not catch the bug/error
        (error) => {
          this.setState({
            isLoaded: true,
            error
          })
        })
      })
  }

  render() {
    const  { movies, isLoaded, error, genreName } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
      return <p>Loading...</p>
    } else {
      return (
        <Fragment>
          <h2>Genre: {genreName}</h2>
          <div className="list-group">
            {movies.map((movie) => (
              <Link 
                className="list-group-item list-group-item-action" 
                to={`/movies/${movie.id}`}
              >
                {movie.title}
              </Link>
            ))}
          </div>
        </Fragment>
      )
    }
  }
}
