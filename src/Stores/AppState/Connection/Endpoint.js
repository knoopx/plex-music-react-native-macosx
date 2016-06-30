// @flow

import Connection from './Connection'

export default class Endpoint {
  connection: Connection
  constructor(connection: Connection) {
    this.connection = connection
  }
}
