import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

export default class Genres extends Component {
  state = {
    genres: [],
    isLoaded: false,
    error: null,
  };

  componentDidMount() {
    fetch("http://localhost:4000/v1/genres")
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
          genres: json.genres,
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
    const { genres, isLoaded, error } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
      return <p>Loading...</p>
    } else {
      return (
        <Fragment>
          <h2>Genres</h2>

          <div className="list-group">
            {genres.map((m) => (
              <Link
                key={m.id}
                className="list-group-item list-group-item-action"
                to={{
                  pathname: `genre/${m.id}`,
                  // genreName will serve as props with path name
                  // this.props.location.genreName
                  genreName: m.genre_name,
                }}
              >
                {m.genre_name}
              </Link>
            ))}
          </div>
        </Fragment>
      )
    }
  }
}
