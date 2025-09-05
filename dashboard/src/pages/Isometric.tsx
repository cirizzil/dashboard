import React, { useMemo } from 'react'
import { Alert, Card, Col, Row, Typography } from 'antd'
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend, Label } from 'recharts'
import { useData } from '../context/FiltersContext'
import { FiltersBar } from '../components/FiltersBar'
import { ExportButtons } from '../components/ExportButtons'
import { InsightsPanel } from '../components/InsightsPanel'

const COLORS = ['#1677ff', '#52c41a', '#fa8c16', '#eb2f96', '#13c2c2', '#722ed1']

export const IsometricPage: React.FC = () => {
  const { iso, filters, loading, error } = useData()

  const filtered = useMemo(() => {
    const elements = iso.elements || []
    const byMaterial = (filters.material === 'All') ? elements : elements.filter(e => (e.material ?? 'Unknown') === filters.material)
    const byType = (filters.elementType === 'All') ? byMaterial : byMaterial.filter(e => e.type === filters.elementType)
    return byType
  }, [iso, filters])

  const elementsByType = useMemo(() => {
    const map = new Map<string, number>()
    filtered.forEach(e => map.set(e.type, (map.get(e.type) ?? 0) + (e.quantity ?? 1)))
    return Array.from(map, ([type, qty]) => ({ type, qty }))
  }, [filtered])

  const materialBreakdown = useMemo(() => {
    const map = new Map<string, number>()
    filtered.forEach(e => map.set(e.material ?? 'Unknown', (map.get(e.material ?? 'Unknown') ?? 0) + (e.quantity ?? 1)))
    return Array.from(map, ([material, qty]) => ({ material, qty }))
  }, [filtered])

  return (
    <>
      <Typography.Title level={3}>Isometric Dashboard</Typography.Title>
      {error && <Alert type="warning" message={error} showIcon style={{ marginBottom: 12 }} />}
      <InsightsPanel />
      <FiltersBar />
      <ExportButtons data={filtered} filename="isometric_filtered" />
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Elements by Type (quantity)" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
                             <BarChart data={elementsByType} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                 <XAxis dataKey="type" angle={-45} textAnchor="end" height={80} />
                 <YAxis allowDecimals={false} />
                 <Tooltip />
                 <Legend />
                 <Bar dataKey="qty" fill="#52c41a" label={{ position: 'top', fill: '#666', formatter: (value) => Math.round(Number(value)) }} />
               </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Material Breakdown" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                 <Pie 
                   data={materialBreakdown} 
                   dataKey="qty" 
                   nameKey="material" 
                   outerRadius={80}
                   label={({ material, qty }) => `${material}: ${Math.round(qty)}`}
                 >
                  {materialBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </>
  )
}
