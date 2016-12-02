/* application/components/Dashboard.js */
import React, { Component } from 'react';
import { TabBarIOS } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import ActivityView from './activity/ActivityView';
import MessagesView from './messages/MessagesView';
import ProfileView from './profile/ProfileView';
import { API } from '../config';
import { log, logerr } from '../utilities';

class Dashboard extends Component{
  constructor(){
    super();
    this.logout = this.logout.bind(this);
    this.logoutError = this.logoutError.bind(this);
    this.state = {
      selectedTab: 'Activity'
    }
  }
  logout(){
    log('Dashboard.logout()');
    fetch(`${API}/users/logout`, { method: 'POST', headers: Headers })
    .then(response => response.json())
    .then(data => this.props.logout())
    .catch(err => this.logoutError(err))
    .done();
  }
  logoutError(err){
    log('logout error', err);
  }
  render(){
    let { user } = this.props;
    return (
      <TabBarIOS>
        <Icon.TabBarItemIOS
          title='Activity'
          selected={this.state.selectedTab === 'Activity'}
          iconName='ios-pulse'
          onPress={() => this.setState({ selectedTab: 'Activity' })}
        >
          <ActivityView currentUser={user}/>
        </Icon.TabBarItemIOS>
        <Icon.TabBarItemIOS
          title='Messages'
          selected={this.state.selectedTab === 'Messages'}
          iconName='ios-chatboxes'
          onPress={() => this.setState({ selectedTab: 'Messages' })}
        >
          <MessagesView currentUser={user}/>
        </Icon.TabBarItemIOS>
        <Icon.TabBarItemIOS
          title='Profile'
          selected={this.state.selectedTab === 'Profile'}
          iconName='ios-person'
          onPress={() => this.setState({ selectedTab: 'Profile' })}
        >
          <ProfileView
            currentUser={user}
            logout={this.logout}
          />
        </Icon.TabBarItemIOS>
      </TabBarIOS>
    )
  }
}

export default Dashboard;