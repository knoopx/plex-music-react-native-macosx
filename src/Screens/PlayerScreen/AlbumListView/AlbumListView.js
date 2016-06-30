// @flow

import React from 'react'
import { observable, computed, action, toJS } from 'mobx'
import { observer } from 'mobx-react/native'
import { autobind, debounce } from 'core-decorators'
import { TextInput, View } from 'react-native-macos'
import Icon from 'react-native-vector-icons/FontAwesome'
import _ from 'lodash'

import AlbumList from './AlbumList'
import { LoadingView, Tab } from '../../../UI'

import { OrderFn, match } from './Support'
import { appState } from '../../../Stores'

import type { FilterSet, PredicateSet } from './Types'

@observer
@autobind
export default class AlbumListView extends React.Component {
  input: ?TextInput
  listView: ?AlbumList

  componentWillMount() {
    this.fetch()
  }

  @observable albums: Array<Object> = [];

  @action async fetch() {
    if (appState.connection) {
      this.isLoading = true
      try {
        this.albums = await appState.connection.albums.findAll()
      } finally {
        this.isLoading = false
      }
    }
  }

  @observable filter: FilterSet = {
    query: '',
    order: 'alphabetically',
    predicates: {}
  }

  @action
  handleClear() {
    if (this.input) { this.input.setNativeProps({ text: '' }) }
    this.performFilterAndSort({ query: '', predicates: {} }, true)
  }

  @action
  @debounce(100)
  handleSearch(text: string) {
    const predicates = {}
    const query = _.reduce([/(\w+):(\w+)/g, /(\w+):"([^"]+)"/g, /(\w+):'([^']+)'/g], (_query, regex) => (
      _query.replace(regex, (__, key, value) => {
        predicates[key] = value
        return ''
      })
    ), text)

    this.performFilterAndSort({ query: query.trim(), predicates }, true)
  }

  @observable isLoading: boolean = false;

  @computed get matches(): Array<Object> {
    const { query, predicates, order = 'alphabetically' } = this.filter
    const filter = toJS({ query, ...predicates })
    return _.filter(this.albums, (row => match(row, filter))).sort(OrderFn[order])
  }

  @action
  performFilterAndSort(filter: FilterSet = {}, shouldScrollToTop: boolean = false) {
    this.filter = { ...this.filter, ...filter }
    if (this.listView && shouldScrollToTop) {
      this.listView.scrollToTop()
    }
  }

  @action
  replaceQueryAndPredicates(text: string, predicates: PredicateSet) {
    if (this.input) { this.input.setNativeProps({ text }) }
    this.performFilterAndSort({ query: '', predicates })
  }

  renderContent() {
    if (this.isLoading) {
      return <LoadingView />
    }

    return <AlbumList ref={(node) => { this.listView = node }} albums={this.matches} delegate={this} />
  }

  renderTab(key: string) {
    const titles = {
      alphabetically: 'Alphabetically',
      recentlyAdded: 'Recently added',
      userRating: 'Rating'
    }

    return (
      <Tab
        key={key}
        active={this.filter.order === key}
        title={titles[key]}
        onPress={() => this.performFilterAndSort({ order: key }, true)}
      />
    )
  }

  renderToolbar() {
    const shouldDisplayClearIcon = !_.isEmpty(this.filter.query) || !_.isEmpty(this.filter.predicates)
    return (
      <View style={{ flexDirection: 'column' }}>
        <View style={{ flexDirection: 'row', backgroundColor: '#f0f0f0' }}>{_.map(_.keys(OrderFn), this.renderTab)}</View>
        <View style={{ height: 1, backgroundColor: '#ddd' }} />
        <View style={{ flex: 1, flexDirection: 'row', padding: 8, alignItems: 'center' }}>
          <TextInput
            ref={(node) => { this.input = node }}
            placeholder="Search..."
            placeholderTextColor="#888"
            focusRingType="none"
            bezeled={false} clearButtonMode="always"
            style={{ flex: 1, fontSize: 16, backgroundColor: 'transparent' }} onChangeText={this.handleSearch}
          />
          <View style={{ width: 10 }} />
          {shouldDisplayClearIcon && <Icon name="times-circle" size={16} color="#888" onPress={this.handleClear} />}
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.renderToolbar()}
        <View style={{ height: 1, backgroundColor: '#ddd' }} />
        {this.renderContent()}
      </View>
    )
  }
}
