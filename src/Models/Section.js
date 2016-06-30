// @flow

import Model from './Model'

export default class Section extends Model {
  id: number
  type: string
  name: string

  static parse(item, connection) {
    return new this(connection, ({
      id: item.key,
      type: item.type,
      name: item.title
    }))
  }
}
