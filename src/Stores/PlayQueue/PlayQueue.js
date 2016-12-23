// @flow

import { action, observable, computed, transaction, IObservableArray } from 'mobx'
import { DeviceEventEmitter, NativeModules } from 'react-native-macos'
import { autobind } from 'core-decorators'

import { PlayListItem } from './Types'

const { AudioPlayer } = NativeModules

@autobind
export default class PlayQueue {
  interval: number;

  @observable currentTime = 0
  @observable duration = 0
  @observable playableDuration = 0
  @observable activeIndex = -1
  @observable playlist: IObservableArray<PlayListItem> = []
  @observable isPlaying = false

  @computed get activeItem() : PlayListItem {
    return this.playlist[this.activeIndex]
  }

  constructor() {
    DeviceEventEmitter.addListener('onPlaybackEnd', this.playNext)
    DeviceEventEmitter.addListener('onPlaybackError', this.onError)
    DeviceEventEmitter.addListener('onPlaybackLoad', this.onLoad)

  }

  startInterval() {
    this.interval = setInterval(() => {
      AudioPlayer.getProgress((err, {currentTime, playableDuration}) => {
        Object.assign(this, {currentTime, playableDuration})
      })
    }, 1000)
  }

  stopInterval() {
    clearInterval(this.interval)
  }

  @action onError(){
    this.stop()
  }

  @action onLoad(e) {
    this.duration = e.duration
  }

  @action pause() {
    AudioPlayer.pause()
    this.stopInterval()
    this.isPlaying = false
  }

  @action resume() {
    if (this.activeItem) {
      this.startInterval()
      AudioPlayer.resume()
      this.isPlaying = true
    }
  }

  @action stop() {
    this.pause()
    this.activeIndex = -1
  }

  @action playItemAtIndex(index: number) {
    const item = this.playlist[index]
    if (item) {
      this.activeIndex = index
      AudioPlayer.play(item.track.url)
      this.isPlaying = true
      this.startInterval()
    } else {
      this.stop()
      this.stopInterval()
    }
  }

  @action playPrev() {
    this.playItemAtIndex(this.activeIndex - 1)
  }

  @action playNext() {
    this.playItemAtIndex(this.activeIndex + 1)
  }

  @action toggle() {
    if (this.isPlaying) {
      this.pause()
    } else {
      this.resume()
    }
  }

  @action seekTo(time: number) {
    AudioPlayer.setCurrentTime(time)
  }

  @action replace(playlist: Array<PlayListItem>, shouldPlay: boolean = false) {
    this.stop()
    transaction(() => {
      this.playlist.replace(playlist)
    })

    if (shouldPlay) {
      this.playItemAtIndex(0)
    }
  }
}
