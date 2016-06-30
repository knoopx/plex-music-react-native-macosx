// @flow

import React from 'react'
import { observer } from 'mobx-react/native'
import { autobind } from 'core-decorators'
import { Text, View } from 'react-native-macos'
import Icon from 'react-native-vector-icons/FontAwesome'

import { appState } from '../../Stores'

import LoginScreen from '../LoginScreen'
import PlayerScreen from '../PlayerScreen'

@observer
@autobind
export default class MainScreen extends React.Component {
  render() {
    if (appState.connection) {
      return (
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <View style={{ flexDirection: 'row', height: 37, alignItems: 'center', paddingHorizontal: 16 }}>
            <View style={{ flex: 1 }} />
            <Text style={{ fontWeight: 'bold' }}>{appState.connection.friendlyName}</Text>
            <View style={{ width: 16 }} />
            <Icon name="eject" size={18} onPress={() => appState.disconnect()} />
          </View>
          <View style={{ height: 1, backgroundColor: '#ddd' }} />
          <PlayerScreen />
        </View>
      )
    }

    return <LoginScreen />
  }
}
