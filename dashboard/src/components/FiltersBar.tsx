import React from 'react'
import { Flex, Select } from 'antd'
import { useData } from '../context/FiltersContext'

export const FiltersBar: React.FC = () => {
  const { pnid, iso, filters, setFilters } = useData()

  const materials = Array.from(new Set(
    [
      ...(pnid.equipments || []).map(e => e.material ?? 'Unknown'),
      ...(pnid.lines || []).map(l => l.material ?? 'Unknown'),
      ...(iso.elements || []).map(e => e.material ?? 'Unknown'),
    ].map(v => v || 'Unknown')
  ))

  const equipmentTypes = Array.from(new Set((pnid.equipments || []).map(e => e.type || 'Unknown')))
  const elementTypes = Array.from(new Set((iso.elements || []).map(e => e.type || 'Unknown')))

  return (
    <Flex gap={12} wrap="wrap" style={{ marginBottom: 16 }}>
      <Select
        style={{ minWidth: 180 }}
        value={filters.material}
        options={[{ value: 'All', label: 'All Materials' }, ...materials.map(m => ({ value: m, label: m }))]}
        onChange={v => setFilters(f => ({ ...f, material: v }))}
      />
      <Select
        style={{ minWidth: 220 }}
        value={filters.equipmentType}
        options={[{ value: 'All', label: 'All Equipment Types' }, ...equipmentTypes.map(t => ({ value: t, label: t }))]}
        onChange={v => setFilters(f => ({ ...f, equipmentType: v }))}
      />
      <Select
        style={{ minWidth: 220 }}
        value={filters.elementType}
        options={[{ value: 'All', label: 'All Element Types' }, ...elementTypes.map(t => ({ value: t, label: t }))]}
        onChange={v => setFilters(f => ({ ...f, elementType: v }))}
      />
    </Flex>
  )
}
