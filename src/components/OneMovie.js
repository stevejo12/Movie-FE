import React, { Component, Fragment } from 'react'

export default class OneMovie extends Component {
  state = { movie: {}, isLoaded: false, error: null };

  componentDidMount() {
    fetch("http://localhost:4000/v1/movie/" + this.props.match.params.id)
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
          movie: json.movie,
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
    const { movie, isLoaded, error } = this.state;
    if (movie.genres) {
      movie.genres = Object.values(movie.genres);
    } else {
      movie.genres = [];
    }


    if (error) {
      return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
      return <p>Loading...</p>
    } else {
      return (
        <Fragment>
          <h2>
            Movie: {movie.title} ({movie.year})
          </h2>
          <div class="clearfix">
            <div class="float-start">
              <small>Rating: {movie.mpaa_rating}</small>
            </div>
            <div class="float-end">
              {movie.genres.map((m, i) => (
                <span className="badge bg-secondary me-1" key={i}>
                  {m}
                </span>
              ))}
            </div>
          </div>
          <hr />
          <table class="table table-compact table-striped">
            <thead></thead>
            <tbody>
              <tr>
                <td><strong>Title:</strong></td>
                <td>{movie.title}</td>
              </tr>
              <tr>
                <td><strong>Description</strong></td>
                <td>{movie.description}</td>
              </tr>
              <tr>
                <td><strong>Run time:</strong></td>
                <td>{movie.runtime}</td>
              </tr>
            </tbody>
          </table>
        </Fragment>
      )
    }
  }
}
