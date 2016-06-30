// @flow

import Axios from 'axios'
import _ from 'lodash'
import { observable, action } from 'mobx'

import AlbumEndpoint from './AlbumEndpoint'
import ArtistEndpoint from './ArtistEndpoint'
import TrackEndpoint from './TrackEndpoint'
import SectionEndpoint from './SectionEndpoint'

import { Section } from '../../../Models'

export default class Connection {
  @observable friendlyName: string

  endpoint: string
  token: string

  albums: AlbumEndpoint
  artists: ArtistEndpoint
  tracks: TrackEndpoint
  sections: SectionEndpoint

  constructor(endpoint: string, token: string) {
    this.endpoint = endpoint
    this.token = token
    this.albums = new AlbumEndpoint(this)
    this.artists = new ArtistEndpoint(this)
    this.tracks = new TrackEndpoint(this)
    this.sections = new SectionEndpoint(this)
    this.fetch()
  }

  @action async fetch() {
    const doc = await this.request('/')
    // eslint-disable-next-line lodash/prefer-lodash-typecheck
    if (doc && doc.friendlyName && typeof doc.friendlyName === 'string') {
      _.assign(this, { friendlyName: doc.friendlyName })
    }
  }

  @action async getArtistSection(): Promise<Section> {
    const sections = await this.sections.findAll()
    const artistSection = _.find(sections, { type: 'artist' })
    if (!artistSection) {
      throw new Error('No artist section found')
    }
    return artistSection
  }

  @action async rate(id: number, rating: number) {
    return this.request('/:/rate', {
      key: id,
      rating,
      identifier: 'com.plexapp.plugins.library'
    })
  }

  @action async request(path: string, query: {} = {}): Promise<mixed> {
    const res = await Axios.get(`${this.endpoint}${path}`, {
      params: query,
      headers: {
        Accept: 'application/json',
        'X-Plex-Token': this.token
      }
    })

    return res.data
  }
}
