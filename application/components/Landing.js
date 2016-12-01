/* application/components/Landing.js */
import Icon from 'react-native-vector-icons/Ionicons';
import React, { Component } from 'react';
import {
  Text,
  TouchableOpacity,
  Image,
  View
} from 'react-native';

import BackgroundImage from '../assets/images/welcome@2x.png';
import Logo from '../assets/images/logo.png';
import Colors from '../styles/colors';
import { landingStyles, globals } from '../styles';

const styles = landingStyles;

class Landing extends Component{
  constructor(){
    super();
    this.visitLogin = this.visitLogin.bind(this);
    this.visitRegister = this.visitRegister.bind(this);
  }
  visitLogin(){
    this.props.navigator.push({ name: 'Login' })
  }
  visitRegister(){
    this.props.navigator.push({ name: 'Register' })
  }
  render(){
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <Image
            style={styles.backgroundImage}
            source={BackgroundImage}
          />
        </View>
        <View style={globals.flexCenter}>
          <Image
            style={styles.logo}
            source={Logo}
          />
          <Text style={[globals.lightText, globals.h2, globals.mb2]}>
            assemblies
          </Text>
          <Text style={[globals.lightText, globals.h4]}>
            Where Developers Connect
          </Text>
        </View>
        <TouchableOpacity
          style={[globals.button, globals.inactive, styles.loginButton]}
          onPress={this.visitLogin}
        >
          <Icon name='ios-lock' size={36} color={Colors.brandPrimary} />
          <Text style={[globals.buttonText, globals.primaryText]}>
            Login
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={globals.button}
          onPress={this.visitRegister}
        >
          <Icon name='ios-person' size={36} color='white' />
          <Text style={globals.buttonText}>
            Create an account
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
};

export default Landing;

