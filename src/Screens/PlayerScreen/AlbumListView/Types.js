export type OrderType = 'alphabetically' | 'userRating' | 'recentlyAdded'

export type Predicate = "artist" | "year" | "genre"

export type PredicateSet = {
  [key: Predicate]: string
}

export type FilterSet = {
  query?: string,
  order?: 'alphabetically' | 'userRating' | 'recentlyAdded',
  predicates?: PredicateSet
}

export type OrderFnSet = {
  [key: OrderType]: Function
}
