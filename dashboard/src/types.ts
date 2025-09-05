export type PNIDEquipment = {
  id: string
  type: string
  tag?: string
  material?: string
}

export type PNIDInstrument = {
  id: string
  type: string
  tag?: string
}

export type PNIDLine = {
  id: string
  size?: string
  material?: string
  service?: string
  type?: string
}

export type IsometricElement = {
  id: string
  type: string
  material?: string
  quantity?: number
  lineId?: string
}

export type PNIDData = {
  equipments: PNIDEquipment[]
  instruments: PNIDInstrument[]
  lines: PNIDLine[]
}

export type IsometricData = {
  elements: IsometricElement[]
}
