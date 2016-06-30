// @flow

import { observable, computed, transaction, IObservableArray } from 'mobx'
import { DeviceEventEmitter, NativeModules } from 'react-native-macos'
import { autobind } from 'core-decorators'

import { PlayListItem } from './Types'

const { AudioPlayer } = NativeModules

@autobind
export default class PlayQueue {
  interval: number;

  @observable currentTime = 0
  @observable duration = 0
  @observable activeIndex = -1
  @observable playlist: IObservableArray<PlayListItem> = []
  @observable isPlaying = false

  @computed get activeItem() : PlayListItem {
    return this.playlist[this.activeIndex]
  }

  constructor() {
    DeviceEventEmitter.addListener('AudioPlayerDidFinishPlaying', this.playNext)
  }

  startInterval() {
    this.interval = setInterval(() => {
      AudioPlayer.getCurrentTime((e, time) => {
        this.currentTime = time
      })
      AudioPlayer.getDuration((e, duration) => {
        this.duration = duration
      })
    }, 1000)
  }

  stopInterval() {
    clearInterval(this.interval)
  }

  pause() {
    AudioPlayer.pause()
    this.stopInterval()
    this.isPlaying = false
  }

  resume() {
    if (this.activeItem) {
      this.startInterval()
      AudioPlayer.resume()
      this.isPlaying = true
    }
  }

  stop() {
    this.pause()
    this.activeIndex = -1
  }

  playItemAtIndex(index: number) {
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

  playPrev() {
    this.playItemAtIndex(this.activeIndex - 1)
  }

  playNext() {
    this.playItemAtIndex(this.activeIndex + 1)
  }

  toggle() {
    if (this.isPlaying) {
      this.pause()
    } else {
      this.resume()
    }
  }

  seekTo(time: number) {
    AudioPlayer.setCurrentTime(time)
  }

  replace(playlist: Array<PlayListItem>, shouldPlay: boolean = false) {
    this.stop()
    transaction(() => {
      this.playlist.replace(playlist)
    })

    if (shouldPlay) {
      this.playItemAtIndex(0)
    }
  }
}