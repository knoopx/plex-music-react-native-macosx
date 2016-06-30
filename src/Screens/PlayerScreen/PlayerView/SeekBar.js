// @flow

import React from 'react'
import { Text, View, Slider } from 'react-native-macos'

function formatDuration(input: number = 0) {
  const z = n => ((n < 10 ? '0' : '')) + n
  return `${z(Math.floor(input / 60))}:${z(Math.floor(input % 60))}`
}

export default class SeekBar extends React.Component {
  props: {
    currentTime: number,
    duration: number,
    onValueChange: (value: number) => *,
    onSlidingComplete: (value: number) => *,

  }

  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <Text>{formatDuration(this.props.currentTime)}</Text>
        <View style={{ width: 10 }} />
        <Slider
          style={{ flex: 1 }}
          value={this.props.currentTime}
          maximumValue={this.props.duration}
          onSlidingComplete={this.props.onSlidingComplete}
          onValueChange={this.props.onValueChange}
        />
        <View style={{ width: 10 }} />
        <Text>{formatDuration(this.props.duration)}</Text>
      </View>
    )
  }
}
