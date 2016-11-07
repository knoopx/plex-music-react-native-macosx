// @flow

import React from 'react'
import moment from 'moment'
import { autobind } from 'core-decorators'

import { action } from 'mobx'
import { View, Text, TouchableOpacity } from 'react-native-macos'

import Device from '../../../Stores/Account/Device'
import { appState } from '../../../Stores'

@autobind
export default class DeviceListItem extends React.Component {
  props: {
    device: Device
  }

  @action async onPress() {
    try {
      await appState.connect(this.props.device)
    } catch (err) {
      // eslint-disable-next-line
      alert(err)
    }
  }

  render() {
    const { device } = this.props
    return (
      <TouchableOpacity key={device.clientIdentifier} onPress={this.onPress}>
        <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#ddd', paddingHorizontal: 16 }}>
          <View style={{ flexDirection: 'column', marginRight: 20 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{device.name}</Text>
            <Text>{moment(device.lastSeenAt).fromNow()}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 14 }}>{device.product} ({device.productVersion})</Text>
            <Text style={{ fontSize: 12 }}>{device.platform} ({device.platformVersion})</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}
