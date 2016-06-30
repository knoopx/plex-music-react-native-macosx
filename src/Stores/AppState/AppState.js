// @flow

import _ from 'lodash'
import { observable, action } from 'mobx'

import Connection from './Connection'
import { Device } from '../Account'

export default class AppState {
  @observable isLoading: boolean = false;
  @observable connection: ?Connection;
  @observable isConnected: boolean = false;

  @action connect(endpoint: string, token: string): Connection {
    try {
      this.connection = new Connection(endpoint, token)
      this.isConnected = true
      return this.connection
    } catch (e) {
      this.disconnect()
      throw e
    }
  }

  @action deviceConnect(device: Device): Connection {
    const connection = _.find(device.connections, c => device.publicAddressMatches && c.local)
    if (connection) {
      return this.connect(connection.uri, device.accessToken)
    }
    throw new Error('Unable to find a suitable connection')
  }


  @action disconnect(): void {
    this.connection = null
    this.isConnected = false
  }
}
