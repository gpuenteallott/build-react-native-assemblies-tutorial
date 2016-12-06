import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity
} from 'react-native';

import moment from 'moment';
import MapView from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';
import Headers from '../../fixtures';
import { find, uniq, contains } from 'underscore';
import Colors from '../../styles/colors';
import BackButton from '../shared/BackButton';
import { globals, groupsStyles } from '../../styles';
import { API, DEV } from '../../config';
const styles = groupsStyles;

const EmptyMap = ({ going, ready }) => (
  <View>
    <View style={[globals.map, globals.inactive, globals.pa1]}/>
    <View style={styles.bottomPanel}>
      <Text style={[globals.h5, globals.primaryText]}>
        { ready ? `${going.length} going` : '' }
      </Text>
    </View>
  </View>
);

const EventMap = ({ location, going, ready }) => {
  if ( ! location || typeof location != 'object' ) {
    return <EmptyMap going={going} ready={ready}/>
  }
  const mapRegion = {
      latitude        : location.lat,
      longitude       : location.lng,
      latitudeDelta   : 0.01,
      longitudeDelta  : 0.01
    }
  return (
    <View style={globals.inactive}>
      <View style={globals.mapContainer}>
        <MapView
          style={globals.map}
          initialRegion={mapRegion}
        />
      </View>
      <View style={[styles.bottomPanel, globals.inactive, globals.pa1]}>
        <Text style={[globals.h5, globals.primaryText]}>
          {location.formattedAddress}
        </Text>
      </View>
    </View>
  )
}

const JoinControls = ({ hasJoined, joinEvent }) => (
  <View style={[styles.joinButtonContainer, globals.mv1]}>
    <TouchableOpacity
      onPress={() => { if (!hasJoined) joinEvent() }}
      style={styles.joinButton}
    >
      <Text style={styles.joinButtonText}>
        { hasJoined ? 'Joined' : 'Join'}
      </Text>
      <Icon
        name={hasJoined ? "ios-checkmark" : "ios-add"}
        size={30}
        color='white'
      />
    </TouchableOpacity>
  </View>
)
class Event extends Component{
  constructor(){
    super();
    this.goBack = this.goBack.bind(this);
    this.joinEvent = this.joinEvent.bind(this);
    this.state = {
      ready         : false,
      eventMembers  : []
    };
  }
  _loadUsers(){
    let query = { id: { $in: this.props.event.going } };
    fetch(`${API}/users?${JSON.stringify(query)}`)
    .then(response => response.json())
    .then(eventMembers => this.setState({ eventMembers }))
    .catch(err => {})
    .done();
  }
  componentDidMount(){
    this._loadUsers();
  }
  joinEvent(){
    let { event, currentUser, updateEvents } = this.props;
    let going = [ ...event.going, currentUser.id ];
    let users = [ ...this.state.eventMembers, currentUser ];
    this.setState({ eventMembers: users });
    fetch(`${API}/events/${event.id}`, {
      method: 'PUT',
      headers: Headers,
      body: JSON.stringify({going: going})
    })
    .then(response => response.json())
    .then(data => updateEvents(data))
    .catch(err => console.log('UPDATE EVENT ERROR: ', err))
    .done();
  }
  goBack(){
    this.props.navigator.pop();
  }
  visitProfile(user){
    if ( user.id === this.props.currentUser.id ) {
      return;
    }
    this.props.navigator.push({
      name: 'Profile',
      user
    })
  }
  render(){
    let { event, group, currentUser, navigator } = this.props;
    let { ready, eventMembers } = this.state;
    let hasJoined = contains(event.going, currentUser.id);
    let justJoined = contains(eventMembers.map(m => m.id), currentUser.id);
    let titleConfig = { title: event.name, tintColor: 'white' };
    return (
      <View style={styles.flexContainer}>
        <NavigationBar
          title={titleConfig}
          tintColor={Colors.brandPrimary}
          leftButton={<BackButton handlePress={this.goBack}/>}
        />
        <ScrollView
          /*style={globals.flexContainer}*/
          contentInset={{ bottom: 49 }}
        >
          <EventMap
            location={event.location}
            going={event.going}
            ready={ready}
          />
          <View style={styles.infoContainer}>
            <Text style={styles.h2}>
              Summary
            </Text>
            <Text style={[styles.h4, globals.mh2]}>
              {event.description ? event.description : 'N/A'}
            </Text>
          </View>
          <View style={globals.lightDivider} />
          <View style={styles.infoContainer}>
            <Text style={styles.h2}>
              Date
            </Text>
            <Text style={[styles.h4, globals.mh2]}>
              {moment(event.start).format('dddd, MMM Do, h:mm')} till {moment(event.end).format('dddd, MMM Do, h:mm')}
            </Text>
          </View>
          <View style={globals.lightDivider} />
          { !hasJoined && <JoinControls hasJoined={justJoined} joinEvent={this.joinEvent} /> }
          <View style={styles.infoContainer}>
            <Text style={styles.h2}>
              Going <Text style={styles.h4}>{eventMembers.length}</Text>
            </Text>
            {eventMembers.map((member, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => this.visitProfile(member)}
                style={globals.flexRow}
              >
                <Image
                  source={{uri: member.avatar}}
                  style={globals.avatar}
                />
                <View style={globals.textContainer}>
                  <Text style={globals.h5}>
                    {member.firstName} {member.lastName}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.break} />
        </ScrollView>
      </View>
    )
  }
}

export default Event;
