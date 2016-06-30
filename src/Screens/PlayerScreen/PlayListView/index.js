// @flow

import React from 'react'
import { observer } from 'mobx-react/native'
import { autobind } from 'core-decorators'

import PlayList from './PlayList'
import { playQueue } from '../../../Stores'

@observer
@autobind
export default class PlaylistView extends React.Component {
  render() {
    return (
      <PlayList items={playQueue.playlist.toJS()} />
    )
  }
}
