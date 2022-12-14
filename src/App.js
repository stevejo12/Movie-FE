import React, { Fragment } from 'react';
import { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Admin from './components/Admin';
import EditMovie from './components/EditMovie';
import GraphQLs from './components/GraphQLs';
import Home from './components/Home';
import Login from './components/Login';
import Movies from './components/Movies';
import OneGenre from './components/OneGenre';
import OneMovie from './components/OneMovie';
import OneMovieGraphQL from './components/OneMovieGraphQL';
import Genres from './Genres';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      jwt: "",
    }

    this.handleJWTChange = this.handleJWTChange.bind(this);
  }

  componentDidMount() {
    let t = window.localStorage.getItem("jwt");

    if (t) {
      if (this.state.jwt === "") {
        this.setState({
          jwt: JSON.parse(t)
        });
      }
    }
  }

  handleJWTChange = (jwt) => {
    this.setState({
      jwt
    })
  }

  logout = () => {
    this.setState({
      jwt: ""
    });
    window.localStorage.removeItem("jwt")
  }

  render() {
    let loginLink;
    if (this.state.jwt === "") {
      loginLink = <Link to="/login">Login</Link>
    } else {
      loginLink = <Link to="/login" onClick={this.logout}>Logout</Link>
    }

    return (
      <Router>
        <div className="container">
          <div className="row">
            <div className="col mt-3">
              <h1 className="mt-3">
                Go Watch a Movie!
              </h1>
            </div>
            <div className="col mt-3 text-end">
              {loginLink}
            </div>
            <hr className="mb-3" />
          </div>
          <div className="row">
            <div className="col-md-2">
              <nav>
                <ul className="list-group">
                  <li className="list-group-item">
                    <Link to="/">Home</Link>
                  </li>
                  <li className="list-group-item">
                    <Link to="/movies">Movies</Link>
                  </li>
                  <li className="list-group-item">
                    <Link to="/genres">Genres</Link>
                  </li>
                  {this.state.jwt !== "" && (
                    <Fragment>
                      <li className="list-group-item">
                        <Link to="/admin/movie/0">Add Movie</Link>
                      </li>
                      <li className="list-group-item">
                        <Link to="/admin">Manage Catalogue</Link>
                      </li>
                    </Fragment>
                  )}
                  <li className="list-group-item">
                    <Link to="/graphql">GraphQL</Link>
                  </li>
                </ul>
                <pre>
                  {JSON.stringify(this.state, null, 3)}
                </pre>
              </nav>
            </div>
            <div className="col-md-10">
              <Switch>
                <Route path="/movies/:id" component={OneMovie} />
                <Route path="/moviesgraphql/:id" component={OneMovieGraphQL} />
                <Route path="/movies">
                  <Movies />
                </Route>
                <Route path="/genre/:id" component={OneGenre} />
                <Route
                  exact
                  path="/login"
                  component={(props) => <Login {...props} handleJWTChange={this.handleJWTChange} />}
                />
                <Route exact path="/genres">
                  <Genres />
                </Route>
                <Route exact path="/graphql">
                  <GraphQLs />
                </Route>
                <Route path="/admin/movie/:id" component={(props) => <EditMovie {...props} jwt={this.state.jwt} />} />
                <Route path="/admin" component={(props) => <Admin {...props} jwt={this.state.jwt} />} />
                <Route path="/">
                  <Home />
                </Route>
              </Switch>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}