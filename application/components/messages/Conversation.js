import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ListView,

} from 'react-native';

import moment from 'moment';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import NavigationBar from 'react-native-navbar';
import Colors from '../../styles/colors';
import { Headers } from '../../fixtures';
import BackButton from '../shared/BackButton';
import { isEqual } from 'underscore';
import { DEV, API } from '../../config';
import { logerr, log, rowHasChanged } from '../../utilities';
import { globals, messagesStyles } from '../../styles';

const styles = messagesStyles;

const Message = ({ user, message }) => {
  return (
    <View style={[globals.centeredRow, globals.pt1]}>
      <View>
        <Image
          style={globals.avatar}
          source={{uri: user.avatar? user.avatar : DefaultAvatar }}
        />
      </View>
      <View style={[styles.flexCentered, globals.pv1]}>
        <View style={globals.flexRow}>
          <Text style={styles.h5}>
            {`${user.firstName} ${user.lastName}`}
          </Text>
          <Text style={styles.h6}>
            {moment(new Date(message.createdAt)).fromNow()}
          </Text>
        </View>
        <View style={globals.flexContainer}>
          <Text style={styles.messageText}>
            {message.text}
          </Text>
        </View>
      </View>
    </View>
  )
};

export default class Conversation extends Component{

  constructor(){
    super();
    this.state = {
      messages: [],
      message: '',
    };
    this.goBack = this.goBack.bind(this);
    this.createMessage = this.createMessage.bind(this);
  }
  goBack(){
    this.props.navigator.pop();
  }
  componentDidMount(){
    this._loadMessages();
  }
  createMessage() {
    this.setState({message: ''});
    fetch(new Request(`${API}/messages`, {
      headers: Headers,
      method: 'POST',
      body: JSON.stringify({
        text: this.state.message,
        createdAt: Date.now(),
        senderId: this.props.currentUser.id,
        recipientId: this.props.user.id,
      }),
    }))
    .then(response => response.json())
    .then(message => this.addMessageToState(message))
    .catch(err => logerr(err))
    .done();
  }
  addMessageToState(message){
    this.setState({
      messages: [
        message,
        ...this.state.messages,
      ],
    });
  }
  _loadMessages(){
    let { currentUser, user } = this.props;
    let query = {
      $or: [
        {
          senderId: currentUser.id,
          recipientId: user.id,
        },
        {
          senderId: user.id,
          recipientId: currentUser.id,
        },
      ],
      $limit: 25, $sort: { createdAt: -1 }
    };
    log('query', query);
    fetch(`${API}/messages?${JSON.stringify(query)}`)
    .then(response => response.json())
    .then(messages => this.setState({ messages }))
    .catch(err => logerr(err))
    .done();
  }
  render(){
    let { user, currentUser } = this.props;
    let titleConfig = {
      title: `${user.firstName} ${user.lastName}`,
      tintColor: 'white'
    };
    return (
      <View style={globals.flexContainer}>
        <NavigationBar
          tintColor={Colors.brandPrimary}
          title={titleConfig}
          leftButton={<BackButton handlePress={this.goBack}/>}
        />
        <InvertibleScrollView inverted={true} style={{flex: 1}}>
          {this.state.messages.map((msg, idx) => {
            let senderUser = isEqual(msg.senderId, currentUser.id) ? currentUser : user;
            return (
              <Message
                key={idx}
                message={msg}
                user={senderUser}
              />
            );
          })}
        </InvertibleScrollView>

        <View style={styles.inputBox}>
          {/* The text input to put on top of the keyboard */}
          <TextInput
            style={styles.input}
            placeholder={'Say something...'}
            placeholderTextColor={Colors.bodyTextLight}
            multiline={true}
            value={this.state.message}
            onChangeText={(message) => this.setState({ message })}
          />
          <TouchableOpacity
            style={ this.state.message ? styles.buttonActive : styles.buttonInactive }
            underlayColor='#D97573'
            onPress={this.createMessage}>
            <Text style={ this.state.message ? styles.submitButtonText : styles.inactiveButtonText }>Send</Text>
          </TouchableOpacity>
        </View>

        {/* The view that will animate to match the keyboards height */}
        <KeyboardSpacer topSpacing={-50}/>
      </View>
    )
  }
};
