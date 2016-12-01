
import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { globals } from '../../styles';

export default BackButton = ({ handlePress }) => (
  <TouchableOpacity
  	onPress={handlePress}
  	style={globals.pa1}
  >
    <Icon name='ios-arrow-back' size={25} color='white' />
  </TouchableOpacity>
);
