import React from 'react'
import { Typography } from 'antd'
import { InsightsPanel } from '../components/InsightsPanel'
import { LinkingTable } from '../components/LinkingTable'

const { Title } = Typography

export const InsightsPage: React.FC = () => {
  return (
    <>
      <Title level={3}>Data Insights & Linking Analysis</Title>
      <InsightsPanel />
      <LinkingTable />
    </>
  )
}
