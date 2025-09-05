import React, { useMemo } from 'react'
import { Card, Col, Row, Statistic, Typography, Tag, Divider } from 'antd'
import { useData } from '../context/FiltersContext'

const { Title, Text } = Typography

export const InsightsPanel: React.FC = () => {
  const { pnid, iso } = useData()

  const insights = useMemo(() => {
    // PNID Insights
    const equipmentTypes = new Map<string, number>()
    const instrumentTypes = new Map<string, number>()
    const lineSizes = new Map<string, number>()
    const lineMaterials = new Map<string, number>()

    pnid.equipments?.forEach(e => {
      equipmentTypes.set(e.type, (equipmentTypes.get(e.type) || 0) + 1)
    })

    pnid.instruments?.forEach(i => {
      instrumentTypes.set(i.type, (instrumentTypes.get(i.type) || 0) + 1)
    })

    pnid.lines?.forEach(l => {
      lineSizes.set(l.size || 'Unknown', (lineSizes.get(l.size || 'Unknown') || 0) + 1)
      lineMaterials.set(l.material || 'Unknown', (lineMaterials.get(l.material || 'Unknown') || 0) + 1)
    })

    // Isometric Insights
    const elementTypes = new Map<string, number>()
    const isoMaterials = new Map<string, number>()

    iso.elements?.forEach(e => {
      elementTypes.set(e.type, (elementTypes.get(e.type) || 0) + (e.quantity || 1))
      isoMaterials.set(e.material || 'Unknown', (isoMaterials.get(e.material || 'Unknown') || 0) + (e.quantity || 1))
    })

    // Find most common items
    const mostCommonEquipment = Array.from(equipmentTypes.entries()).sort((a, b) => b[1] - a[1])[0]
    const mostCommonInstrument = Array.from(instrumentTypes.entries()).sort((a, b) => b[1] - a[1])[0]
    const mostCommonElement = Array.from(elementTypes.entries()).sort((a, b) => b[1] - a[1])[0]

    // Find largest line size
    const lineSizeEntries = Array.from(lineSizes.entries())
    const largestLineSize = lineSizeEntries
      .filter(([size]) => size !== 'Unknown')
      .sort((a, b) => {
        const aNum = parseFloat(a[0].replace(/[^0-9.]/g, ''))
        const bNum = parseFloat(b[0].replace(/[^0-9.]/g, ''))
        return bNum - aNum
      })[0]

    // Link analysis
    const pnidLineIds = new Set(pnid.lines?.map(l => l.id) || [])
    const isoLineIds = new Set(iso.elements?.map(e => e.lineId).filter(Boolean) || [])
    const linkedLineIds = new Set([...pnidLineIds].filter(id => isoLineIds.has(id)))
    const unlinkedPnidLines = pnidLineIds.size - linkedLineIds.size
    const unlinkedIsoElements = isoLineIds.size - linkedLineIds.size

    return {
      mostCommonEquipment,
      mostCommonInstrument,
      mostCommonElement,
      largestLineSize,
      totalEquipment: pnid.equipments?.length || 0,
      totalInstruments: pnid.instruments?.length || 0,
      totalLines: pnid.lines?.length || 0,
      totalElements: iso.elements?.length || 0,
      linkedLines: linkedLineIds.size,
      unlinkedPnidLines,
      unlinkedIsoElements,
      lineMaterials: Array.from(lineMaterials.entries()).sort((a, b) => b[1] - a[1]),
      isoMaterials: Array.from(isoMaterials.entries()).sort((a, b) => b[1] - a[1]),
    }
  }, [pnid, iso])

  return (
    <Card title="Summary Insights" style={{ marginBottom: 16 }}>
      <Row gutter={[16, 16]}>
        {/* PNID Statistics */}
        <Col xs={24} md={8}>
          <Title level={5}>PNID Overview</Title>
          <Statistic title="Total Equipment" value={insights.totalEquipment} />
          <Statistic title="Total Instruments" value={insights.totalInstruments} />
          <Statistic title="Total Lines" value={insights.totalLines} />
          {insights.mostCommonEquipment && (
            <div style={{ marginTop: 8 }}>
              <Text strong>Most Common Equipment: </Text>
              <Tag color="blue">{insights.mostCommonEquipment[0]} ({insights.mostCommonEquipment[1]})</Tag>
            </div>
          )}
          {insights.mostCommonInstrument && (
            <div style={{ marginTop: 4 }}>
              <Text strong>Most Common Instrument: </Text>
              <Tag color="green">{insights.mostCommonInstrument[0]} ({insights.mostCommonInstrument[1]})</Tag>
            </div>
          )}
          {insights.largestLineSize && (
            <div style={{ marginTop: 4 }}>
              <Text strong>Largest Line Size: </Text>
              <Tag color="orange">{insights.largestLineSize[0]} ({insights.largestLineSize[1]} lines)</Tag>
            </div>
          )}
        </Col>

        {/* Isometric Statistics */}
        <Col xs={24} md={8}>
          <Title level={5}>Isometric Overview</Title>
          <Statistic title="Total Elements" value={insights.totalElements} />
          {insights.mostCommonElement && (
            <div style={{ marginTop: 8 }}>
              <Text strong>Most Common Element: </Text>
              <Tag color="purple">{insights.mostCommonElement[0]} ({insights.mostCommonElement[1]} items)</Tag>
            </div>
          )}
          {insights.isoMaterials.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <Text strong>Top Materials: </Text>
              <div style={{ marginTop: 4 }}>
                {insights.isoMaterials.slice(0, 3).map(([material, count]) => (
                  <Tag key={material} color="cyan" style={{ marginBottom: 4 }}>
                    {material} ({count})
                  </Tag>
                ))}
              </div>
            </div>
          )}
        </Col>

        {/* Data Linking Analysis */}
        <Col xs={24} md={8}>
          <Title level={5}>Data Linking</Title>
          <Statistic title="Linked Lines" value={insights.linkedLines} />
          <Statistic title="Unlinked PNID Lines" value={insights.unlinkedPnidLines} />
          <Statistic title="Unlinked ISO Elements" value={insights.unlinkedIsoElements} />
          
          <Divider style={{ margin: '12px 0' }} />
          
          <div style={{ marginTop: 8 }}>
            <Text strong>Link Coverage: </Text>
            <Tag color={insights.linkedLines > 0 ? "success" : "error"}>
              {insights.totalLines > 0 ? Math.round((insights.linkedLines / insights.totalLines) * 100) : 0}%
            </Tag>
          </div>
          
          {insights.lineMaterials.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <Text strong>Top Line Materials: </Text>
              <div style={{ marginTop: 4 }}>
                {insights.lineMaterials.slice(0, 3).map(([material, count]) => (
                  <Tag key={material} color="gold" style={{ marginBottom: 4 }}>
                    {material} ({count})
                  </Tag>
                ))}
              </div>
            </div>
          )}
        </Col>
      </Row>
    </Card>
  )
}
