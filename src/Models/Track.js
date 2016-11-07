// @flow

import { observable } from 'mobx'

import Model from './Model'

export default class Track extends Model {
  @observable number: number;
  @observable title: string;
  @observable artistName: string;
  @observable albumId: number;
  @observable duration: number;
  @observable path: string;
  @observable url: string;

  static parse(item, connection) {
    const { uri, device } = connection
    return new this(connection, {
      id: item.ratingKey,
      number: item.index,
      title: item.title.trim(),
      artistName: item.grandparentTitle.trim(),
      albumId: item.grandparentRatingKey,
      duration: item.duration,
      path: item._children[0]._children[0].file,
      url: `${uri}${item._children[0]._children[0].key}?X-Plex-Token=${encodeURIComponent(device.accessToken)}`
    })
  }
}
