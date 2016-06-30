// @flow

import _ from 'lodash'
import Endpoint from './Endpoint'
import { Artist } from '../../../Models'

export default class Artists extends Endpoint {
  async findAll(query: {} = {}): Promise<Array<Artist>> {
    const section = await this.connection.getArtistSection()
    const doc = await this.connection.request(`/library/sections/${section.id}/all`, { type: 8, ...query })
    if (!doc._children || !_.isArray(doc._children)) { throw new Error('Unexpected response') }
    return _.map(doc._children, item => Artist.parse(item, this.connection))
  }
}
