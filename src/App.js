// @flow

import React from 'react'
import { action } from 'mobx'
import { observer } from 'mobx-react/native'

import { appState, account } from './Stores'
import { LoadingView } from './UI'
import { MainScreen } from './Screens'

import type { LoginParams } from './Stores/Account/Types'

@observer
export default class App extends React.Component {
  componentWillMount() {
    this.performAutoLogin()
  }

  @action async performAutoLogin() {
    appState.isLoading = true

    let loginParams: ?LoginParams
    try {
      loginParams = await account.getLoginParams()
      if (loginParams) {
        await account.login(loginParams)
      }
    } finally {
      appState.isLoading = false
    }
  }

  render() {
    if (appState.isLoading) {
      return <LoadingView />
    }
    return <MainScreen />
  }
}
