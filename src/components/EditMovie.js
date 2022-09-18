import React, { Component, Fragment } from 'react'

import './EditMovie.css';
import Input from './form-components/Input';
import Select from './form-components/Select';
import TextArea from './form-components/TextArea';

export default class EditMovie extends Component {
  constructor(props) {
    super(props);

    this.state = {
      movie: {
        id: 0,
        title: "",
        release_date: "",
        runtime: "",
        mpaa_rating: "",
        rating: "",
        description: "",
      },
      mpaaOptions: [
        {id: "G", value: "G"},
        {id: "PG", value: "PG"},
        {id: "PG13", value: "PG13"},
        {id: "R", value: "R"},
        {id: "NC17", value: "NC17"},
      ],
      isLoaded: false,
      error: null,
      errors: [],
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    if (id > 0) {
      fetch("http://localhost:4000/v1/movie/" + id)
        .then((response) => {
          if (response.status !== "200") {
            let err = Error;
            err.message = "Invalid response code: " + response.status;
            this.setState({
              error: err
            });
          }

          return response.json();
        })
        .then((json) => {
          const releaseDate = new Date(json.movie.release_date);

          this.setState(
            {
              movie: {
                id: id,
                title: json.movie.title,
                release_date: releaseDate.toISOString().split("T")[0],
                runtime: json.movie.runtime,
                mpaa_rating: json.movie.mpaa_rating,
                rating: json.movie.rating,
                description: json.movie.description,
              },
              isLoaded: true
            },
            (error) => {
              this.setState({
                isLoaded: true,
                error,
              })
            }
          )
        })
    } else {
      this.setState({
        isLoaded: true
      })
    }
  }

  hasError(key) {
    return this.state.errors.indexOf(key) !== -1;
  }

  handleChange = (event) => {
    let value = event.target.value;
    let name = event.target.name;

    this.setState((prevState) => ({
      movie: {
        ...prevState.movie,
        [name]: value,
      }
    }))
  }

  handleSubmit = (event) => {
    event.preventDefault();

    // client side validation
    let errors = [];
    if (this.state.movie.title === "") {
      errors.push("title")
    }

    this.setState({
      errors
    })

    if (errors.length > 0) {
      return false;
    }

    const data = new FormData(event.target);
    const payload = Object.fromEntries(data.entries());

    console.log(payload);

    const requestOptions = {
      method: "POST",
      body: JSON.stringify(payload)
    }

    fetch("http://localhost:4000/v1/admin/editmovie", requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
  }

  render() {
    const { movie, mpaaOptions, isLoaded, error } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
      return <p>Loading...</p>
    } else {
      return (
        <Fragment>
          <h2>Add / Edit Movie</h2>
          <hr />
          <form onSubmit={this.handleSubmit}>
            <input 
              type="hidden" 
              name="id" 
              id="id" 
              value={movie.id} 
              onChange={this.handleChange} 
            />
            
            <Input 
              className={this.hasError("title") ? "is-invalid" : ""}
              name={"title"} 
              title={"Title"} 
              type={"text"} 
              value={movie.title} 
              handleChange={this.handleChange} 
              errorDiv={this.hasError("title") ? "text-danger" : "d-none"}
              errorMsg={"Please enter a title"}
            />
            
            <Input 
              name={"release_date"} 
              title={"Release Date"} 
              type={"date"} 
              value={movie.release_date} 
              handleChange={this.handleChange} 
            />
            
            <Input 
              name={"runtime"} 
              title={"Run Time"} 
              type={"text"} 
              value={movie.runtime} 
              handleChange={this.handleChange} 
            />
            
            <Select 
              title={"MPAA Rating"}
              name={"mpaa_rating"}
              options={mpaaOptions}
              value={movie.mpaa_rating} 
              handleChange={this.handleChange}
              placeholder={"Choose..."}
            />
            
            <Input 
              name={"rating"} 
              title={"Rating"} 
              type={"text"} 
              value={movie.rating} 
              handleChange={this.handleChange} 
            />
            
            <TextArea 
              rows={"3"} 
              name={"description"} 
              title={"Description"} 
              value={movie.description} 
              handleChange={this.handleChange} 
            />
            
            <hr />
            
            <button className="btn btn-primary">Save</button>
          </form>
          <div className="mt-3">
            <pre>{JSON.stringify(this.state, null, 2)}</pre>
          </div>
        </Fragment>
      )
    }
  }
}
