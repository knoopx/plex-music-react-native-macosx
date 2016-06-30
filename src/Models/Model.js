// @flow

import _ from 'lodash'
import { Connection } from '../Stores/AppState/Connection'

export default class Model {
  connection: Connection
  constructor(connection: Object, props: {}) {
    this.connection = connection
    _.assign(this, props)
  }
}
