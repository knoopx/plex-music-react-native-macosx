// @flow

import React from 'react'
import { observer } from 'mobx-react/native'
import { autobind } from 'core-decorators'
import { ListView } from 'react-native-macos'

import PlayListItem from './PlayListItem'

import type { PlayListItem as TPlayListItem } from '../../../Stores/PlayQueue/Types'

const dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2
})

@observer
@autobind
export default class List extends React.Component {
  props: {
    items: Array<TPlayListItem>,
  }

  renderRow(row: TPlayListItem) {
    return <PlayListItem item={row} />
  }

  render() {
    return (
      <ListView
        style={{ flex: 1 }}
        dataSource={dataSource.cloneWithRows(this.props.items)}
        renderRow={this.renderRow}
        showsVerticalScrollIndicator
      />
    )
  }
}
