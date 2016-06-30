// @flow

import React from 'react'
import { observer } from 'mobx-react/native'
import { autobind } from 'core-decorators'
import { Image, Text, View, TouchableOpacity } from 'react-native-macos'

import { playQueue } from '../../../Stores'
import type { PlayListItem as TPlayListItem } from '../../../Stores/PlayQueue/Types'

@observer
@autobind
export default class PlayListItem extends React.Component {
  props: {
    item: TPlayListItem
  }

  onPress(item: PlayListItem) {
    playQueue.playItemAtIndex(playQueue.playlist.indexOf(item))
  }

  render() {
    const { item } = this.props
    const { album, track } = item

    const backgroundColor = item === playQueue.activeItem ? '#f0f0f0' : 'transparent'

    return (
      <TouchableOpacity onPress={() => { this.onPress(item) }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#ddd', backgroundColor, padding: 8 }}>
          <Image style={{ width: 32, height: 32, borderRadius: 4 }} source={{ uri: album.artwork }} />
          <View style={{ width: 10 }} />
          <View style={{ flexDirection: 'column' }}>
            <Text style={{ fontWeight: 'bold' }}>{track.title}</Text>
            <Text style={{ color: '#888' }}>{track.artistName}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}
