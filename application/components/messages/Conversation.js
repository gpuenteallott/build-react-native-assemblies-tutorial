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
  log('Message', message);
  return (
    <Text style={styles.messageText}>{message.text}</Text>
  )
};

export default class Conversation extends Component{

  constructor(){
    super();
    this.state = {
      messages: [],
    };
    this.goBack = this.goBack.bind(this);
    this.dataSource = this.dataSource.bind(this);
    this._renderRow = this._renderRow.bind(this);
  }
  goBack(){
    this.props.navigator.pop();
  }
  componentDidMount(){
    this._loadMessages();
  }
  _loadMessages(){
    let { currentUser } = this.props;
    let query = {
      $or: [
        { senderId: currentUser.id },
        { recipientId: currentUser.id }
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
  dataSource() {
    log('messages', this.state.messages);
    return (
      new ListView.DataSource({ rowHasChanged : rowHasChanged })
      .cloneWithRows(this.state.messages)
    );
  }
  _renderRow(message, idx) {

    return (
      <Message
        key={idx}
        user={this.props.currentUser}
        message={message}
      />
    )
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
        <View style={globals.flexCenter}>
          <ListView
            renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
            dataSource={this.dataSource()}
            // renderHeader={this._renderHeader}
            renderRow={this._renderRow}
            enableEmptySections={true}
            contentInset={{ bottom: 49 }}
          />
        </View>
      </View>
    )
  }
};
