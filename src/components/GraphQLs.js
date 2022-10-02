import React, { Component } from 'react'
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Input from './form-components/Input';

export default class GraphQLs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      isLoaded: false,
      error: null,
      alert: {
        type: "d-none",
        message: "",
      },
      searchTerm: "",
    }

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const payload = `
    {
      list {
        id
        title
        runtime
        year
        description
      }
    }
    `

    const myHeader = new Headers();
    myHeader.append("Content-Type", "application/json")

    const requestOptions = {
      method: "POST",
      body: payload,
      headers: myHeader
    }

    fetch("http://localhost:4000/v1/graphql", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        let theList = Object.values(data.data.list);

        return theList
      })
      .then((theList) => {
        this.setState({
          movies: theList
        })
      })
  }

  handleChange = (event) => {
    const value = event.target.value;

    this.setState((prevState) => ({
      searchTerm: value,
    }))

    if (value.length > 2) {
      this.performSearch();
    } else {
      this.setState({
        movies: []
      });
    }

  }

  performSearch() {
    const payload = `
    {
      search(titleContains: "${this.state.searchTerm}") {
        id
        title
        runtime
        year
        description
      }
    }
    `

    const myHeader = new Headers();
    myHeader.append("Content-Type", "application/json")

    const requestOptions = {
      method: "POST",
      body: payload,
      headers: myHeader
    }

    fetch("http://localhost:4000/v1/graphql", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        let theList = Object.values(data.data.search);

        return theList
      })
      .then((theList) => {
        if (theList.length > 0) {
          this.setState({
            movies: theList
          })
        } else {
          this.setState({
            movies: []
          })
        }
      })
  }

  render() {
    let { movies } = this.state;

    return (
      <Fragment>
        <h2>GraphQLs</h2>
        <hr />
        <Input 
          title={"Search"}
          type={"text"}
          name={"search"}
          value={this.state.searchTerm}
          handleChange={this.handleChange}
        />
        <div className="list-group">
          {movies.map((movie) => (
            <Link 
              key={movie.id}
              to={`/moviesgraphql/${movie.id}`}
              className="list-group-item list-group-item-action"
            >
              <strong>{movie.title}</strong>
              <br />
              <small className="text-muted">
                ({movie.year}) - {movie.runtime} minutes
              </small>
              <br />
              {movie.description.slice(0,100)}...
            </Link>
          ))}
        </div>
      </Fragment>
    )
  }
}
