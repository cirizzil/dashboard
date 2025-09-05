import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider, App as AntApp, Layout, Menu, theme, Badge, Button } from 'antd'
import { SunOutlined, MoonOutlined } from '@ant-design/icons'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import './style.css'
import { FiltersProvider, useData } from './context/FiltersContext'
import { PNIDPage } from './pages/PNID'
import { IsometricPage } from './pages/Isometric'
import { InsightsPage } from './pages/Insights'

function ApiStatus() {
  const { loading, error } = useData()
  const status = loading ? 'processing' : error ? 'error' : 'success'
  const text = loading ? 'Contacting API...' : error ? 'API Error' : 'API Connected'
  const color = status === 'success' ? 'green' : status === 'error' ? 'red' : 'gold'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Badge color={color} text={null} />
      <span style={{ fontSize: '14px' }}>{text}</span>
    </div>
  )
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true)

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <ConfigProvider theme={{ algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
      <AntApp>
        <BrowserRouter>
          <FiltersProvider>
            <Shell isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
          </FiltersProvider>
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  )
}

function Shell({ isDarkMode, onToggleTheme }: { isDarkMode: boolean; onToggleTheme: () => void }) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Header>
        <div style={{ float: 'left', color: '#fff', fontWeight: 600, marginRight: 24 }}>Engineering Dashboard</div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectable={false}
          items={[
            { key: 'pnid', label: <Link to="/pnid">PNID</Link> },
            { key: 'isometric', label: <Link to="/isometric">Isometric</Link> },
            { key: 'insights', label: <Link to="/insights">Insights</Link> },
          ]}
        />
        <div style={{ float: 'right', marginTop: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
          <Button
            type="text"
            icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
            onClick={onToggleTheme}
            style={{ color: 'inherit' }}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          />
          <ApiStatus />
        </div>
      </Layout.Header>
      <Layout.Content style={{ padding: 24 }}>
        <Routes>
          <Route path="/pnid" element={<PNIDPage />} />
          <Route path="/isometric" element={<IsometricPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="*" element={<Navigate to="/pnid" replace />} />
        </Routes>
      </Layout.Content>
    </Layout>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)


