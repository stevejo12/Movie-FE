import React, { Fragment, Component } from 'react'
import { Link } from 'react-router-dom';

export default class Movies extends Component {
  state = { 
    movies: [],
    isLoaded: false,
    error: null
  };

  componentDidMount() {
    fetch(`${process.env.REACT_APP_API_URL}/v1/movies`)
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
          movies: json.movies,
          isLoaded: true
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
    const  { movies, isLoaded, error } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
      return <p>Loading...</p>
    } else {
      return (
        <Fragment>
          <h2>Choose Movies</h2>
          <div className="list-group">
            {movies.map((movie) => (
              <Link 
                key={movie.id}
                to={`/movies/${movie.id}`}
                className="list-group-item list-group-item-action"
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
