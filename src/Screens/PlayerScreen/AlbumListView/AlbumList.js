// @flow

import React from 'react'
import { autobind } from 'core-decorators'
import { ListView, View } from 'react-native-macos'

import AlbumListItem from './AlbumListItem'
import AlbumListView from './AlbumListView'

const dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2
})

@autobind
export default class AlbumList extends React.Component {
  listView: ?ListView

  props: {
    albums: Array<Object>,
    delegate: AlbumListView
  }

  scrollToTop() {
    if (this.listView) { this.listView.scrollTo({ x: 0, y: 0 }) }
  }

  renderRow(row: Object) {
    return (
      <AlbumListItem album={row} delegate={this.props.delegate} />
    )
  }

  renderSeparator(_: any, index: number) {
    return <View key={index} style={{ height: 1, backgroundColor: '#ddd' }} />
  }

  render() {
    return (
      <ListView
        ref={(node) => { this.listView = node }}
        dataSource={dataSource.cloneWithRows(this.props.albums)}
        renderRow={this.renderRow}
        renderSeparator={this.renderSeparator}
        showsVerticalScrollIndicator
      />
    )
  }
}
