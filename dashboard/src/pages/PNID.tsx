import React, { useMemo, useState } from 'react'
import { Alert, Card, Col, Row, Table, Typography, Select, Space } from 'antd'
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend, Label } from 'recharts'
import { useData } from '../context/FiltersContext'
import { FiltersBar } from '../components/FiltersBar'
import { ExportButtons } from '../components/ExportButtons'
import { InsightsPanel } from '../components/InsightsPanel'

const COLORS = ['#1677ff', '#52c41a', '#fa8c16', '#eb2f96', '#13c2c2', '#722ed1']

export const PNIDPage: React.FC = () => {
  const { pnid, filters, loading, error } = useData()
  const [lineSortBy, setLineSortBy] = useState<string>('count-desc')

  const filtered = useMemo(() => ({
    equipments: (pnid.equipments || []).filter(e =>
      (filters.material === 'All' || (e.material ?? 'Unknown') === filters.material) &&
      (filters.equipmentType === 'All' || e.type === filters.equipmentType)
    ),
    instruments: pnid.instruments || [],
    lines: (pnid.lines || []).filter(l =>
      (filters.material === 'All' || (l.material ?? 'Unknown') === filters.material)
    ),
  }), [pnid, filters])

  const eqByType = useMemo(() => {
    const map = new Map<string, number>()
    filtered.equipments.forEach(e => map.set(e.type, (map.get(e.type) ?? 0) + 1))
    return Array.from(map, ([type, count]) => ({ type, count }))
  }, [filtered.equipments])

  const instrumentsByType = useMemo(() => {
    const map = new Map<string, number>()
    filtered.instruments.forEach(i => map.set(i.type, (map.get(i.type) ?? 0) + 1))
    return Array.from(map, ([type, count]) => ({ type, count }))
  }, [filtered.instruments])

  const lineDiamMaterial = useMemo(() => {
    const map = new Map<string, number>()
    filtered.lines.forEach(l => {
      const key = `${l.size ?? 'Unknown'} | ${l.material ?? 'Unknown'}`
      map.set(key, (map.get(key) ?? 0) + 1)
    })
    let result = Array.from(map, ([key, count]) => {
      const [size, material] = key.split(' | ')
      return { key, size, material, count }
    })

    // Sort based on selected option
    switch (lineSortBy) {
      case 'size-asc':
        result.sort((a, b) => {
          const aNum = parseFloat(a.size.replace(/[^0-9.]/g, '')) || 0
          const bNum = parseFloat(b.size.replace(/[^0-9.]/g, '')) || 0
          return aNum - bNum
        })
        break
      case 'size-desc':
        result.sort((a, b) => {
          const aNum = parseFloat(a.size.replace(/[^0-9.]/g, '')) || 0
          const bNum = parseFloat(b.size.replace(/[^0-9.]/g, '')) || 0
          return bNum - aNum
        })
        break
      case 'material-asc':
        result.sort((a, b) => a.material.localeCompare(b.material))
        break
      case 'material-desc':
        result.sort((a, b) => b.material.localeCompare(a.material))
        break
      case 'count-asc':
        result.sort((a, b) => a.count - b.count)
        break
      case 'count-desc':
      default:
        result.sort((a, b) => b.count - a.count)
        break
    }

    return result
  }, [filtered.lines, lineSortBy])

  return (
    <>
      <Typography.Title level={3}>PNID Dashboard</Typography.Title>
      {error && <Alert type="warning" message={error} showIcon style={{ marginBottom: 12 }} />}
      <InsightsPanel />
      <FiltersBar />
      <ExportButtons data={[...filtered.equipments, ...filtered.lines]} filename="pnid_filtered" />
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Equipments by Type" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
                             <BarChart data={eqByType} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                 <XAxis dataKey="type" angle={-45} textAnchor="end" height={80} />
                 <YAxis allowDecimals={false} />
                 <Tooltip />
                 <Legend />
                 <Bar dataKey="count" fill="#1677ff" label={{ position: 'top', fill: '#666', formatter: (value) => Math.round(Number(value)) }} />
               </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Instruments by Type" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                 <Pie 
                   data={instrumentsByType} 
                   dataKey="count" 
                   nameKey="type" 
                   outerRadius={80}
                   label={({ type, count }) => `${type}: ${Math.round(count)}`}
                 >
                  {instrumentsByType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={24}>
          <Card 
            title={
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <span>Lines: Diameter & Material</span>
                <Select
                  value={lineSortBy}
                  onChange={setLineSortBy}
                  style={{ width: 200 }}
                  options={[
                    { value: 'count-desc', label: 'Count (High to Low)' },
                    { value: 'count-asc', label: 'Count (Low to High)' },
                    { value: 'size-desc', label: 'Size (Large to Small)' },
                    { value: 'size-asc', label: 'Size (Small to Large)' },
                    { value: 'material-asc', label: 'Material (A to Z)' },
                    { value: 'material-desc', label: 'Material (Z to A)' },
                  ]}
                />
              </Space>
            }
            loading={loading}
          >
            <Table
              size="small"
              rowKey="key"
              pagination={{ pageSize: 10 }}
              columns={[
                { 
                  title: 'Size', 
                  dataIndex: 'size',
                  sorter: (a, b) => {
                    const aNum = parseFloat(a.size.replace(/[^0-9.]/g, '')) || 0
                    const bNum = parseFloat(b.size.replace(/[^0-9.]/g, '')) || 0
                    return aNum - bNum
                  }
                },
                { 
                  title: 'Material', 
                  dataIndex: 'material',
                  sorter: (a, b) => a.material.localeCompare(b.material)
                },
                { 
                  title: 'Count', 
                  dataIndex: 'count',
                  sorter: (a, b) => a.count - b.count
                },
              ]}
              dataSource={lineDiamMaterial}
            />
          </Card>
        </Col>
      </Row>
    </>
  )
}
