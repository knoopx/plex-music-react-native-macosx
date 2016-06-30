// @flow

import React from 'react'
import { observer } from 'mobx-react/native'
import { Image, Text, View } from 'react-native-macos'

import { playQueue } from '../../Stores'

@observer
export default class NowPlaying extends React.Component {
  render() {
    const { activeItem } = playQueue

    if (activeItem) {
      return (
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', padding: 10 }}>
          <Image style={{ width: 64, height: 64, borderRadius: 4 }} source={{ uri: activeItem.album.artwork }} />
          <View style={{ width: 10 }} />
          <View style={{ flexDirection: 'column' }}>
            <Text style={{ fontWeight: 'bold' }}>{activeItem.track.title}</Text>
            <Text>{activeItem.album.title}</Text>
            <Text style={{ color: '#888' }}>{activeItem.track.artistName}</Text>
          </View>
        </View>
      )
    }

    return <View style={{ flex: 1 }} />
  }
}
