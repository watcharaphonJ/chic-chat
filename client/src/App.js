import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Register from './reg'
import Login from './login'
import Home from './home'
import Edit from './editProfile'
import FriendList from './friendList'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
export default class App extends Component {
  render() {
    return (
      <Router>
        <Route exact path="/" component={Login} />
        <Route exact path="/reg" component={Register} />
        <Route exact path="/home" component={Home} />
        <Route exact path="/FriendList" component={FriendList} />
        <Route exact path="/edit" component={Edit} />

      </Router>
    )
  }
}
