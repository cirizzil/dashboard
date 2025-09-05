import React from 'react'
import { Button, Flex } from 'antd'

function download(filename: string, content: string, mime = 'text/plain') {
  const blob = new Blob([content], { type: mime + ';charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}

export const ExportButtons: React.FC<{ data: unknown[]; filename: string }> = ({ data, filename }) => {
  const onJSON = () => download(`${filename}.json`, JSON.stringify(data, null, 2), 'application/json')

  const onCSV = () => {
    if (!data.length) return
    const keys = Array.from(new Set(data.flatMap(d => Object.keys(d as any))))
    const rows = [
      keys.join(','),
      ...data.map(d =>
        keys.map(k => {
          const v = (d as any)[k]
          const cell = typeof v === 'string' ? `"${v.replace(/"/g, '""')}"` : v ?? ''
          return cell
        }).join(',')
      ),
    ].join('\n')
    download(`${filename}.csv`, rows, 'text/csv')
  }

  return (
    <Flex gap={8} style={{ marginBottom: 12 }}>
      <Button onClick={onCSV}>Export CSV</Button>
      <Button onClick={onJSON}>Export JSON</Button>
    </Flex>
  )
}
