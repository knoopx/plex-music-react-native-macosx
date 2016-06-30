// @flow

import React from 'react'
import { View } from 'react-native-macos'
import { observer } from 'mobx-react/native'

import { playQueue } from '../../Stores'
import PlayListView from './PlayListView'
import NowPlaying from './NowPlaying'
import AlbumListView from './AlbumListView'
import PlayerView from './PlayerView'

@observer
export default class PlayerScreen extends React.Component {
  renderPlayerBar() {
    if (playQueue.activeItem) {
      return (
        <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#ddd' }}>
          <NowPlaying />
          <PlayerView />
        </View>
      )
    }
    return null
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'white' }}>
          <AlbumListView />
          <View style={{ width: 1, backgroundColor: '#ddd' }} />
          <PlayListView />
        </View>

        {this.renderPlayerBar()}
      </View>
    )
  }
}
