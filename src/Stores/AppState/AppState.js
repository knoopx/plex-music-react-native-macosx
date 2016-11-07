// @flow

import _ from 'lodash'
import { observable, action } from 'mobx'

import Connection from './Connection'
import { Device } from '../Account'

export default class AppState {
  @observable isLoading: boolean = false;
  @observable connection: ?Connection;
  @observable isConnected: boolean = false;

  @action connect(device: Device): Connection {
    try {
      this.connection = new Connection(device)
      this.isConnected = true
      return this.connection
    } catch (e) {
      this.disconnect()
      throw e
    }
  }

  @action disconnect(): void {
    this.connection = null
    this.isConnected = false
  }
}
