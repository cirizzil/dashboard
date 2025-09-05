import type { IsometricData } from '../types'

export const isoMock: IsometricData = {
  elements: [
    { id: 'el-1', type: 'pipe', material: 'CS', quantity: 6, lineId: 'L-100' },
    { id: 'el-2', type: 'elbow', material: 'CS', quantity: 4, lineId: 'L-100' },
    { id: 'el-3', type: 'weld', material: 'CS', quantity: 8, lineId: 'L-101' },
    { id: 'el-4', type: 'pipe', material: 'SS', quantity: 3, lineId: 'L-102' },
    { id: 'el-5', type: 'elbow', material: 'SS', quantity: 2, lineId: 'L-103' },
  ],
}
