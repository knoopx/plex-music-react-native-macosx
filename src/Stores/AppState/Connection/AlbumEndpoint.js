// @flow

import _ from 'lodash'
import Endpoint from './Endpoint'
import { Album } from '../../../Models'

export default class Albums extends Endpoint {
  async find(id: number): Promise<Album> {
    const doc = this.connection.request(`/library/metadata/${id}`)
    // eslint-disable-next-line lodash/prefer-lodash-method
    if (!doc.MediaContainer || !Array.isArray(doc.MediaContainer.Directory)) { throw new Error('Unexpected response') }
    return Album.parse(doc.MediaContainer.Directory[0], this.connection)
  }

  async findAll(query: {} = { excludeFields: ['summary', 'parentThumb', 'originallyAvailableAt'] }): Promise<Array<Album>> {
    const section = await this.connection.getArtistSection()
    const doc = await this.connection.request(`/library/sections/${section.id}/all`, { type: 9, ...query })
    if (!doc._children || !_.isArray(doc._children)) { throw new Error('Unexpected response') }
    return _.map(doc._children, item => Album.parse(item, this.connection))
  }
}
