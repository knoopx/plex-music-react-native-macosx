// @flow

import Axios from 'axios'
import _ from 'lodash'
import { observable, action } from 'mobx'

import AlbumEndpoint from './AlbumEndpoint'
import ArtistEndpoint from './ArtistEndpoint'
import TrackEndpoint from './TrackEndpoint'
import SectionEndpoint from './SectionEndpoint'

import { Device } from '../../Account'
import { Section } from '../../../Models'

export default class Connection {
  @observable friendlyName: string

  device: Device
  albums: AlbumEndpoint
  artists: ArtistEndpoint
  tracks: TrackEndpoint
  sections: SectionEndpoint

  constructor(device: Device) {
    this.device = device
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

  get uri(): string {
    const { uri } = _.find(this.device.connections, { local: this.device.publicAddressMatches })
    if (uri) {
      return uri
    }
    throw new Error('Unable to find a suitable connection')
  }

  get localUri(): string {
    const { uri } = _.find(this.device.connections, { local: true })
    if (uri) {
      return uri
    }
    throw new Error('Unable to find a suitable connection')
  }

  @action async request(path: string, query: {} = {}): Promise<mixed> {
    const res = await Axios.get(`${this.uri}${path}`, {
      params: query,
      headers: {
        Accept: 'application/json',
        'X-Plex-Token': this.device.accessToken
      }
    })

    return res.data
  }
}
