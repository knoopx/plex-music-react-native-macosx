// @flow

import React from 'react'
import _ from 'lodash'
import { action } from 'mobx'
import { observer } from 'mobx-react/native'
import { autobind } from 'core-decorators'
import { Image, TouchableOpacity, Text, View } from 'react-native-macos'
import Icon from 'react-native-vector-icons/FontAwesome'

import AlbumListView from './AlbumListView'
import { Album } from '../../../Models'
import { appState, playQueue } from '../../../Stores'

@observer
@autobind
export default class AlbumListItem extends React.Component {
  props: {
    album: Album;
    delegate: AlbumListView;
  }

  onPressArtistName(artistName: string) {
    this.props.delegate.replaceQueryAndPredicates(`artist:"${artistName}"`, { artist: artistName })
  }

  onPressGenre(genre: string) {
    this.props.delegate.replaceQueryAndPredicates(`genre:"${genre}"`, { genre })
  }

  onPressYear(year: string) {
    this.props.delegate.replaceQueryAndPredicates(`year:${year}`, { year })
  }

  onPress() {
    const { album } = this.props

    if (appState.connection) {
      appState.connection.tracks.findAllByAlbumId(album.id).then((tracks) => {
        const items = _.map(tracks, t => ({ track: t, album }))
        playQueue.replace(items, true)
      })
    }
  }

  onStar(userRating: number) {
    const { album } = this.props

    if (album.userRating === userRating) {
      this.performRate(album, 0)
    } else {
      this.performRate(album, userRating)
    }
  }

  @action async performRate(album: Album, userRating: number) {
    await album.rate(userRating)
    _.assign(album, { userRating })
    this.props.delegate.performFilterAndSort()
  }

  renderGenre(genre: string, index: number, album: Album) {
    return (
      <View key={genre} style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => this.onPressGenre(genre)}>
          <Text style={{ color: '#888', fontSize: 12 }}>{genre}{index !== album.genres.length - 1 && '/'}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderStar(index: number) {
    const { album } = this.props

    return (
      <Icon
        key={index}
        onPress={() => { this.onStar(index + 1) }}
        style={{ margin: 2 }}
        name={index <= album.userRating - 1 ? 'star' : 'star-o'}
        size={18}
        suppressHighlighting
      />
    )
  }

  render() {
    const { album } = this.props
    const backgroundColor = album === (playQueue.activeItem && playQueue.activeItem.album) ? '#f0f0f0' : 'transparent'

    return (
      <TouchableOpacity onPress={this.onPress}>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 8, backgroundColor }} >
          <Image style={{ width: 48, height: 48, borderRadius: 4 }} source={{ uri: album.artwork }} />
          <View style={{ width: 10 }} />
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={{ fontWeight: 'bold' }}>{album.title}</Text>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => this.onPressArtistName(album.artistName)}>
                <Text style={{ color: '#888' }}>{album.artistName}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ width: 10 }} />
          <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-end' }}>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => this.onPressYear(album.year)}>
                <Text style={{ color: '#888', fontSize: 12 }}>{album.year}</Text>
              </TouchableOpacity>
            </View>
            {album.genres.length > 0 && <View style={{ flexDirection: 'row' }}>{_.map(album.genres, (g, i) => this.renderGenre(g, i, album))}</View>}
          </View>
          <View style={{ width: 15 }} />
          <View style={{ flexDirection: 'row' }}>
            {_.map(Array.from(Array(5).keys()), this.renderStar)}
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}
