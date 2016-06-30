// @flow

import Axios from 'axios'
import UUID from 'uuid'
import { flow, filter, map } from 'lodash/fp'
import { DOMParser } from 'xmldom'
import { AsyncStorage } from 'react-native-macos'
import { observable, action } from 'mobx'

import Device from './Device'
import type { LoginParams } from './Types'

import { appState } from '../AppState'

export default class Account {
  @observable devices: Array<Device>
  @observable isLoggedIn: boolean = false;

  @action async login(loginParams: LoginParams): Promise<void> {
    const clientIdentifier = await this.getClientIdentifier()
    const auth = await this.performLogin(loginParams, clientIdentifier)

    // eslint-disable-next-line lodash/prefer-lodash-method
    if (auth && auth.data && auth.data.authToken) {
      // eslint-disable-next-line lodash/prefer-lodash-typecheck
      if (typeof auth.data.authToken === 'string') {
        this.devices = await this.fetchDevices(auth.data.authToken)
        await AsyncStorage.setItem('loginParams', JSON.stringify(loginParams))
        this.isLoggedIn = true

        if (this.devices.length === 1) {
          appState.deviceConnect(this.devices[0])
        }
      }
    }
  }

  @action async getLoginParams(): Promise<?LoginParams> {
    const loginParams = await AsyncStorage.getItem('loginParams')
    if (loginParams) { return JSON.parse(loginParams) }
    return null
  }

  @action async getClientIdentifier(): Promise<string> {
    const value = await AsyncStorage.getItem('X-Plex-Client-Identifier')
    if (value) { return value }
    const newValue = UUID.v4()
    await AsyncStorage.setItem('X-Plex-Client-Identifier', newValue)
    return newValue
  }

  @action async fetchDevices(authToken: string): Promise<Array<Device>> {
    const res = await Axios.get('https://plex.tv/api/resources', { params: { 'X-Plex-Token': authToken, Accept: 'application/json' }, headers: { Accept: 'application/json' } })
    const doc = new DOMParser().parseFromString(res.data)
    return flow(map(device => Device.parse(device)), filter(d => d.presence && d.provides === 'server'))(doc.getElementsByTagName('Device'))
  }

  @action async performLogin(loginParams: LoginParams, clientIdentifier: string): Promise<mixed> {
    return Axios.post('https://plex.tv/api/v2/users/signin', loginParams, {
      headers: {
        'X-Plex-Client-Identifier': clientIdentifier,
        'X-Plex-Device-Name': 'Plex Music',
        'X-Plex-Product': 'Plex Music',
        'X-Plex-Device': 'OSX',
        Accept: 'application/json'
      }
    })
  }
}
