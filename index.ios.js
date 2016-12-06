
import React, { Component } from 'react';
import {
  AppRegistry,
  ActivityIndicator,
  Navigator,
  AsyncStorage,
  View,
} from 'react-native';

import Landing from './application/components/Landing';
import Dashboard from './application/components/Dashboard';
import Register from './application/components/accounts/Register';
import RegisterConfirmation from './application/components/accounts/RegisterConfirmation';
import Login from './application/components/accounts/Login';
import { globals } from './application/styles';
import { logerr, log } from './application/utilities';
import { API } from './application/config';
import { extend } from 'underscore';
import Headers from './application/fixtures';
import Loading from './application/components/shared/Loading';

class assemblies extends Component {
  constructor(){
    super();
    this.updateUser = this.updateUser.bind(this);
    this.logout = this.logout.bind(this);
    this.ready = this.ready.bind(this);
    this.fetchUser = this.fetchUser.bind(this);
    this.state = {
      user: null,
      ready: false,
    };
  }
  componentDidMount(){
    this._loadLoginCredentials()
  }
  updateUser(user){
    if (user !== null && !user.id) {
      throw new Error('updateUser takes a user object with an id.');
    }
    // If null, clear out cached session id.
    if (user === null){
      AsyncStorage.removeItem('sid');
    }
    this.setState({ user: user });
  }
  logout(){
    this.nav.push({ name: 'Landing' });
    this.updateUser(null);
  }
  async _loadLoginCredentials() {
    try {
      let sid = await AsyncStorage.getItem('sid');
      log('index sid', sid);
      if (typeof sid === 'string'){
        this.fetchUser(sid);
      } else {
        this.ready();
      }
    } catch (err) {
      this.ready(err);
    }
  }
  fetchUser(sid){
    fetch(`${API}/users/me`, {
      headers: extend(Headers, { 'Set-Cookie': `sid=${sid}` }),
    })
    .then(response => {
      if (response.status != 200) {
        return null;
      } else {
        return response.json();
      }
    })
    .then(user => this.updateUser(user))
    .then(() => this.ready())
    .catch(err => logerr(err))
    .done();
  }
  ready() {
    this.setState({
      ready: true,
    });
    console.log("READY");
  }
  render() {
    if ( !this.state.ready ) { return <Loading /> }

    let initialRoute = !this.state.user ? 'Landing' : 'Dashboard';

    return (
      <Navigator
        style={globals.flex}
        ref={(el) => this.nav = el }
        initialRoute={{ name: initialRoute }}
        renderScene={(route, navigator) => {
          switch(route.name){
            case 'Landing':
              return (
                <Landing navigator={navigator}/>
            );
            case 'Dashboard':
              return (
                <Dashboard
                  navigator={navigator}
                  updateUser={this.updateUser}
                  logout={this.logout}
                  user={this.state.user}
                />
            );
            case 'Register':
              return (
                <Register
                  navigator={navigator}
                  updateUser={this.updateUser}
                />
            );
            case 'Login':
              return (
                <Login
                  navigator={navigator}
                  updateUser={this.updateUser}
                />
            );
            case 'RegisterConfirmation':
              return (
                <RegisterConfirmation
                  {...route}
                  updateUser={this.updateUser}
                  navigator={navigator}
                />
              );
          }
        }}
      />
    );
  }
}

AppRegistry.registerComponent('assemblies', () => assemblies);
