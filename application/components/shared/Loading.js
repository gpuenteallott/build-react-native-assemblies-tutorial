
import React from 'react';
import {
  ActivityIndicator,
  View,
} from 'react-native';
import { globals } from '../../styles';

export default Loading = () => (
  <View style={globals.flexCenter}>
    <ActivityIndicator size='large'/>
  </View>
);
