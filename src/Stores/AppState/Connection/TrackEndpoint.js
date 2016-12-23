// @flow

import _ from 'lodash'
import Endpoint from './Endpoint'
import { Track } from '../../../Models'

export default class Tracks extends Endpoint {
  async findAllByAlbumId(albumId: number): Promise<Array<Track>> {
    const doc = await this.connection.request(`/library/metadata/${albumId}/children`, { includeRelated: 0 })
    if (!doc.MediaContainer || !_.isArray(doc.MediaContainer.Metadata)) { throw new Error('Unexpected response') }
    const tracks = _.map(doc.MediaContainer.Metadata, item => Track.parse(item, this.connection))
    return _.orderBy(tracks, ['path', 'number'])
  }
}
