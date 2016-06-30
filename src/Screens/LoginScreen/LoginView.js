// @flow

import React from 'react'
import { observable } from 'mobx'
import { observer } from 'mobx-react/native'
import { autobind } from 'core-decorators'
import { View, TextInput, Button } from 'react-native-macos'

import { account } from '../../Stores'

import type { LoginParams } from '../../Stores/Account/Types'

@observer
@autobind
export default class LoginView extends React.Component {
  @observable loginParams: LoginParams = {
    login: '',
    password: ''
  }

  render() {
    return (
      <View style={{ flex: 1, paddingTop: 37, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around' }}>
        <View style={{ width: 300, flexDirection: 'column', alignItems: 'center' }}>
          <TextInput
            style={{ flex: 1, fontSize: 18, borderWidth: 0, height: 32 }}
            value={this.loginParams.login}
            placeholder={'Address'}
            onChangeText={(value) => { this.loginParams.login = value }}
          />
          <TextInput
            style={{ flex: 1, fontSize: 18, borderWidth: 0, height: 32 }}
            value={this.loginParams.password}
            placeholder={'Address'}
            onChangeText={(value) => { this.loginParams.password = value }}
          />
          <Button
            bezelStyle="rounded"
            style={{ marginTop: 10, width: 100, height: 40 }}
            onClick={() => account.login(this.loginParams)}
            title="Connect"
          />
        </View>
      </View>
    )
  }
}
