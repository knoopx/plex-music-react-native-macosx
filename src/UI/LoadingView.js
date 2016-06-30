// @flow

import React from 'react'
import { View, Text, ActivityIndicator } from 'react-native-macos'

export default class LoadingView extends React.Component {
  props: {
    message?: string
  }

  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around' }}>
        <View>
          <ActivityIndicator size="large" style={{ marginBottom: 20 }} />
          {this.props.message && <Text>{this.props.message}</Text>}
        </View>
      </View>
    )
  }
}
