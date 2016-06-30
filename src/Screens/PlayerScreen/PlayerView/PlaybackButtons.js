// @flow

import React from 'react'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react/native'

import { Button, View } from 'react-native-macos'
import Icon from 'react-native-vector-icons/FontAwesome'

import { playQueue } from '../../../Stores'

@observer
export default class PlaybackButtons extends React.Component {
  @observable isLoading = true;
  @observable images: {
    nextIcon: string,
    prevIcon: string,
    pauseIcon: string,
    playIcon: string
  };

  componentWillMount() {
    this.loadImages()
  }

  @action async loadImages() {
    this.images = {
      nextIcon: await Icon.getImageSource('fast-forward', 16, 'black'),
      prevIcon: await Icon.getImageSource('fast-backward', 16, 'black'),
      pauseIcon: await Icon.getImageSource('pause', 16, 'black'),
      playIcon: await Icon.getImageSource('play', 16, 'black')
    }
    this.isLoading = false
  }

  render() {
    if (this.isLoading) { return null }

    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Button style={{ width: 64, height: 54 }} image={this.images.prevIcon} bezelStyle="rounded" onClick={() => playQueue.playPrev()} />
        <Button style={{ width: 64, height: 64, marginHorizontal: -8 }} image={playQueue.isPlaying ? this.images.pauseIcon : this.images.playIcon} bezelStyle="rounded" onClick={() => playQueue.toggle()} />
        <Button style={{ width: 64, height: 54 }} image={this.images.nextIcon} bezelStyle="rounded" onClick={() => playQueue.playNext()} />
      </View>
    )
  }
}
