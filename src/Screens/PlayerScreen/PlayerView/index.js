// @flow
import React from 'react'
import { View } from 'react-native-macos'
import { observable } from 'mobx'
import { observer } from 'mobx-react/native'

import { playQueue } from '../../../Stores'

import SeekBar from './SeekBar'
import PlaybackButtons from './PlaybackButtons'

@observer
export default class PlayerView extends React.Component {
  @observable isSeeking = false

  render() {
    const { currentTime, duration } = playQueue
    return (
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', paddingHorizontal: 10 }}>
        <SeekBar style={{ flex: 1 }} currentTime={currentTime} duration={duration} onSlidingComplete={value => playQueue.seekTo(value)} onValueChange={() => { this.isSeeking = true }} />
        <View style={{ width: 10 }} />
        <PlaybackButtons />
      </View>
    )
  }
}
