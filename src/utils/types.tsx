export interface IPainting {
  title: string
  primaryimageurl: string
  people: Artist[]
  dated: string
  period: string
  medium: string
  culture: string
  division: string
  colors: Color[]
}

export interface ICoordinate {
  lat?: number
  lon?: number
}

interface Artist {
  name: string
  birthplace: string
  culture: string
}

interface Color {
  color: string
}

export interface ICoordData {
  display_name: string
  place_id: number
  lat: number
  lon: number
}

export interface IWikiResult {
  coordinates: ICoordinate[]
  title: string
  pageid: number
  extract: string
}
