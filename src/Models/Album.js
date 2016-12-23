// @flow

import { map } from 'lodash/'
import { observable } from 'mobx'

import Model from './Model'

export default class Album extends Model {
  id: number
  @observable title: string
  @observable artistName: string
  @observable year: string
  @observable userRating: number
  @observable addedAt: number
  @observable playCount: number
  @observable tag: Array<string>
  @observable genres: Array<string>
  @observable artwork: ?string

  rate(rating: number) {
    return this.connection.rate(this.id, rating)
  }

  static parse(item, connection) {
    const { uri, localUri, port, device } = connection
    const thumbUrl = item.thumb && (`${localUri}${item.thumb}`)
    return new this(connection, {
      id: item.ratingKey,
      title: item.title.trim(),
      artistName: item.parentTitle.trim(),
      year: item.year,
      userRating: item.userRating,
      addedAt: item.addedAt * 1000,
      playCount: item.viewCount,
      tag: [],
      genres: map(item.Genre, e => e.tag.trim()),
      artwork: thumbUrl && (`${uri}/photo/:/transcode?url=${encodeURIComponent(thumbUrl)}&width=250&height=250&minSize=1&X-Plex-Token=${encodeURIComponent(device.accessToken)}`)
    })
  }
}
