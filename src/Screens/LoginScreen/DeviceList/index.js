// @flow

import React from 'react'
import _ from 'lodash'
import { autobind } from 'core-decorators'

import { View } from 'react-native-macos'

import { Device } from '../../../Stores/Account'
import DeviceListItem from './DeviceListItem'

@autobind
export default class DeviceList extends React.Component {
  props: {
    devices: Array<Device>
  }

  renderItem(device: Device) {
    return <DeviceListItem key={device.clientIdentifier} device={device} />
  }

  render() {
    return (
      <View style={{ flex: 1, paddingTop: 37, flexDirection: 'column', backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
        {_.map(this.props.devices, this.renderItem)}
      </View>
    )
  }
}
