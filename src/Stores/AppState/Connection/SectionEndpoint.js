// @flow

import _ from 'lodash'
import Endpoint from './Endpoint'
import { Section } from '../../../Models'

export default class Sections extends Endpoint {
  async findAll(): Promise<Array<Section>> {
    const doc = await this.connection.request('/library/sections')
    if (!doc._children || !_.isArray(doc._children)) { throw new Error('Unexpected response') }
    return _.map(doc._children, item => Section.parse(item, this.connection))
  }
}
