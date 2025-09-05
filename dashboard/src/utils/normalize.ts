import type { IsometricData, PNIDData } from '../types'

export const normalizeSize = (raw?: string) => {
  if (!raw) return 'Unknown'
  const s = raw.toString().toLowerCase().replace(/\s+/g, '')
  
  // Handle DN format
  if (s.startsWith('dn')) {
    const n = Number(s.replace('dn', ''))
    if (!Number.isNaN(n)) {
      if (n <= 25) return '1 in'
      if (n <= 40) return '1.5 in'
      if (n <= 50) return '2 in'
      if (n <= 80) return '3 in'
      if (n <= 100) return '4 in'
      if (n <= 150) return '6 in'
      if (n <= 200) return '8 in'
      return `${Math.round(n / 25.4)} in`
    }
  }
  
  // Handle inch format (e.g., "8", "8\"", "8 in")
  const inchMatch = s.match(/(\d+(?:\.\d+)?)\s*(?:in|"|inch)?/)
  if (inchMatch) {
    const num = parseFloat(inchMatch[1])
    if (!Number.isNaN(num)) {
      return `${num} in`
    }
  }
  
  // Handle other numeric formats
  const num = s.replace(/[^0-9.]/g, '')
  return num ? `${num} in` : 'Unknown'
}

export const normalizeMaterial = (raw?: string) => {
  if (!raw) return 'Unknown'
  const s = raw.trim().toUpperCase()
  
  // Handle common material names
  if (['CARBON STEEL', 'CARBON-STEEL', 'CS'].includes(s)) return 'CS'
  if (['STAINLESS STEEL', 'STAINLESS-STEEL', 'S.S', 'SS.', 'SS316', 'SS304'].includes(s)) return 'SS'
  if (['ALLOY', 'ALLOY825'].includes(s)) return 'ALLOY'
  if (['PP', 'PP-R'].includes(s)) return 'PP'
  if (['DSS', 'DSS2205'].includes(s)) return 'DSS'
  
  // Handle spec format (e.g., "CS-40-150" -> "CS")
  const specMatch = s.match(/^([A-Z]+)-\d+-\d+/)
  if (specMatch) {
    const materialCode = specMatch[1]
    if (materialCode === 'CS') return 'CS'
    if (materialCode === 'SS') return 'SS'
    if (materialCode === 'ALLOY') return 'ALLOY'
    if (materialCode === 'PP') return 'PP'
    if (materialCode === 'DSS') return 'DSS'
    return materialCode
  }
  
  return s
}

export function normalizePNID(data: any): PNIDData {
  return {
    equipments: (data.equipment || []).map((e: any) => ({
      id: e.equipment_id || e.id || String(Math.random()),
      type: (e.type || 'Unknown').trim(),
      tag: e.tag || e.equipment_id,
      material: normalizeMaterial(e.material),
    })),
    instruments: (data.instruments || []).map((i: any) => ({
      id: i.instrument_id || i.id || String(Math.random()),
      type: (i.type || 'Unknown').trim(),
      tag: i.instrument_id,
    })),
    lines: (data.lines || []).map((l: any) => ({
      id: l.line_id || l.id || String(Math.random()),
      size: normalizeSize(l.size_in ? `${l.size_in}"` : l.size),
      material: normalizeMaterial(l.material || l.spec),
      service: l.service,
      type: (l.type || 'Unknown').trim(),
    })),
  }
}

export function normalizeISO(data: any): IsometricData {
  return {
    elements: (data.rows || []).map((row: any) => ({
      id: row.id || String(Math.random()),
      type: (row.type || 'Unknown').trim().toLowerCase(),
      material: normalizeMaterial(row.material),
      quantity: row.quantity ?? 1,
      lineId: row.line_number,
    })),
  }
}
