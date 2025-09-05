import React, { useMemo, useState } from 'react'
import { Card, Table, Input, Tag, Typography, Space, Tooltip } from 'antd'
import { SearchOutlined, LinkOutlined, DisconnectOutlined } from '@ant-design/icons'
import { useData } from '../context/FiltersContext'

const { Search } = Input
const { Text } = Typography

export const LinkingTable: React.FC = () => {
  const { pnid, iso } = useData()
  const [searchText, setSearchText] = useState('')

  const linkingData = useMemo(() => {
    const pnidLinesMap = new Map(pnid.lines?.map(l => [l.id, l]) || [])
    const isoElementsByLineId = new Map<string, any[]>()
    
    // Group isometric elements by line ID
    iso.elements?.forEach(element => {
      if (element.lineId) {
        if (!isoElementsByLineId.has(element.lineId)) {
          isoElementsByLineId.set(element.lineId, [])
        }
        isoElementsByLineId.get(element.lineId)!.push(element)
      }
    })

    const result: any[] = []

    // Add linked lines
    pnid.lines?.forEach(line => {
      const isoElements = isoElementsByLineId.get(line.id) || []
      if (isoElements.length > 0) {
        result.push({
          key: `linked-${line.id}`,
          lineId: line.id,
          pnidLine: line,
          isoElements,
          status: 'linked',
          elementCount: isoElements.length,
        })
      }
    })

    // Add unlinked PNID lines
    pnid.lines?.forEach(line => {
      const isoElements = isoElementsByLineId.get(line.id) || []
      if (isoElements.length === 0) {
        result.push({
          key: `unlinked-pnid-${line.id}`,
          lineId: line.id,
          pnidLine: line,
          isoElements: [],
          status: 'unlinked-pnid',
          elementCount: 0,
        })
      }
    })

    // Add unlinked ISO elements
    iso.elements?.forEach(element => {
      if (element.lineId && !pnidLinesMap.has(element.lineId)) {
        result.push({
          key: `unlinked-iso-${element.id}`,
          lineId: element.lineId,
          pnidLine: null,
          isoElements: [element],
          status: 'unlinked-iso',
          elementCount: 1,
        })
      }
    })

    return result
  }, [pnid, iso])

  const filteredData = useMemo(() => {
    if (!searchText) return linkingData
    
    return linkingData.filter(item => 
      item.lineId?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.pnidLine?.size?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.pnidLine?.material?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.isoElements.some((el: any) => 
        el.type?.toLowerCase().includes(searchText.toLowerCase()) ||
        el.material?.toLowerCase().includes(searchText.toLowerCase())
      )
    )
  }, [linkingData, searchText])

  const columns = [
    {
      title: 'Line ID',
      dataIndex: 'lineId',
      key: 'lineId',
      width: 120,
      render: (lineId: string, record: any) => (
        <Space>
          {record.status === 'linked' && <LinkOutlined style={{ color: '#52c41a' }} />}
          {record.status === 'unlinked-pnid' && <DisconnectOutlined style={{ color: '#fa8c16' }} />}
          {record.status === 'unlinked-iso' && <DisconnectOutlined style={{ color: '#eb2f96' }} />}
          <Text code>{lineId}</Text>
        </Space>
      ),
    },
    {
      title: 'PNID Line',
      key: 'pnidLine',
      width: 200,
      render: (record: any) => {
        if (!record.pnidLine) {
          return <Text type="secondary">No PNID line</Text>
        }
        return (
          <Space direction="vertical" size={0}>
            <Text strong>Size: {record.pnidLine.size || 'Unknown'}</Text>
            <Text>Material: {record.pnidLine.material || 'Unknown'}</Text>
            {record.pnidLine.service && <Text>Service: {record.pnidLine.service}</Text>}
          </Space>
        )
      },
    },
    {
      title: 'Isometric Elements',
      key: 'isoElements',
      render: (record: any) => {
        if (record.isoElements.length === 0) {
          return <Text type="secondary">No isometric elements</Text>
        }
        return (
          <Space direction="vertical" size={4}>
            {record.isoElements.map((element: any, index: number) => (
              <Tooltip key={element.id || index} title={`Quantity: ${element.quantity || 1}`}>
                <Tag color="blue">
                  {element.type} ({element.material || 'Unknown'})
                </Tag>
              </Tooltip>
            ))}
          </Space>
        )
      },
    },
    {
      title: 'Status',
      key: 'status',
      width: 120,
      render: (record: any) => {
        const statusConfig = {
          linked: { color: 'success', text: 'Linked' },
          'unlinked-pnid': { color: 'warning', text: 'PNID Only' },
          'unlinked-iso': { color: 'error', text: 'ISO Only' },
        }
        const config = statusConfig[record.status as keyof typeof statusConfig]
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    {
      title: 'Element Count',
      dataIndex: 'elementCount',
      key: 'elementCount',
      width: 100,
      render: (count: number) => <Text strong>{count}</Text>,
    },
  ]

  const summaryStats = useMemo(() => {
    const linked = linkingData.filter(item => item.status === 'linked').length
    const unlinkedPnid = linkingData.filter(item => item.status === 'unlinked-pnid').length
    const unlinkedIso = linkingData.filter(item => item.status === 'unlinked-iso').length
    const total = linkingData.length

    return { linked, unlinkedPnid, unlinkedIso, total }
  }, [linkingData])

  return (
    <Card 
      title={
        <Space>
          <span>PNID ↔ Isometric Linking</span>
          <Tag color="blue">{summaryStats.linked} Linked</Tag>
          <Tag color="orange">{summaryStats.unlinkedPnid} PNID Only</Tag>
          <Tag color="red">{summaryStats.unlinkedIso} ISO Only</Tag>
        </Space>
      }
      style={{ marginBottom: 16 }}
    >
      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search by Line ID, size, material, or element type..."
          allowClear
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ maxWidth: 400 }}
        />
      </div>
      
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        }}
        scroll={{ x: 800 }}
        size="small"
      />
    </Card>
  )
}
