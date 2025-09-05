import type { PNIDData } from '../types'

export const pnidMock: PNIDData = {
  equipments: [
    { id: 'eq-1', type: 'Pump', tag: 'P-101', material: 'CS' },
    { id: 'eq-2', type: 'Pump', tag: 'P-102', material: 'SS' },
    { id: 'eq-3', type: 'Valve', tag: 'V-10', material: 'CS' },
    { id: 'eq-4', type: 'Compressor', tag: 'C-01', material: 'CS' },
  ],
  instruments: [
    { id: 'ins-1', type: 'Pressure Indicator', tag: 'PI-100' },
    { id: 'ins-2', type: 'Temperature Indicator', tag: 'TI-200' },
    { id: 'ins-3', type: 'Pressure Indicator', tag: 'PI-101' },
  ],
  lines: [
    { id: 'L-100', size: '6 in', material: 'CS', service: 'Process', type: 'Process' },
    { id: 'L-101', size: '4in', material: 'CS', service: 'Utility', type: 'Utility' },
    { id: 'L-102', size: 'DN150', material: 'SS', service: 'Process', type: 'Process' },
    { id: 'L-103', size: '2 in', material: 'SS', service: 'Utility', type: 'Utility' },
  ],
}
