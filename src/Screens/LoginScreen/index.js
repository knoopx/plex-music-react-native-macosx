// @flow

import React from 'react'
import { autobind } from 'core-decorators'
import { observer } from 'mobx-react/native'

import LoginView from './LoginView'
import DeviceList from './DeviceList'

import { account } from '../../Stores'

@observer
@autobind
export default class LoginScreen extends React.Component {
  render() {
    if (account.isLoggedIn) {
      return <DeviceList devices={account.devices} />
    }

    return <LoginView />
  }
}
