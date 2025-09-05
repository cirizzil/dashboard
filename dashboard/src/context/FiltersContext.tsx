import React, { createContext, useContext, useEffect, useState } from 'react'
import { normalizeISO, normalizePNID } from '../utils/normalize'
import type { IsometricData, PNIDData } from '../types'
import { api } from '../api/client'

async function fetchViaProcess(): Promise<{ pnid: PNIDData; iso: IsometricData }> {
  const [pnidRes, isoRes] = await Promise.all([
    api.post<PNIDData>(
      '/pnid:process',
      { fileUrl: 'https://testing.asets.io/docs/pnid_001.pdf', options: { normalize: true } },
      { headers: { 'Content-Type': 'application/json' } }
    ).then(r => r.data),
    api.post<IsometricData>(
      '/isometric:process',
      { fileUrl: 'https://testing.asets.io/docs/iso_014.png', options: { normalize: true } },
      { headers: { 'Content-Type': 'application/json' } }
    ).then(r => r.data),
  ])
  return { pnid: pnidRes, iso: isoRes }
}

type Filters = { material: string | 'All'; equipmentType: string | 'All'; elementType: string | 'All' }

type DataContext = {
  pnid: PNIDData
  iso: IsometricData
  filters: Filters
  setFilters: React.Dispatch<React.SetStateAction<Filters>>
  loading: boolean
  error?: string
}

const emptyPnid: PNIDData = { equipments: [], instruments: [], lines: [] }
const emptyIso: IsometricData = { elements: [] }

const Ctx = createContext<DataContext | null>(null)

export const FiltersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pnid, setPnid] = useState<PNIDData>(emptyPnid)
  const [iso, setIso] = useState<IsometricData>(emptyIso)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | undefined>()

  const [filters, setFilters] = useState<Filters>({ material: 'All', equipmentType: 'All', elementType: 'All' })

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(undefined)
      try {
        const { pnid, iso } = await fetchViaProcess()
        if (cancelled) return
        setPnid(normalizePNID(pnid))
        setIso(normalizeISO(iso))
      } catch (e) {
        if (cancelled) return
        setError(e instanceof Error ? e.message : 'Failed to fetch API data.')
        setPnid(emptyPnid)
        setIso(emptyIso)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  return (
    <Ctx.Provider value={{ pnid, iso, filters, setFilters, loading, error }}>
      {children}
    </Ctx.Provider>
  )
}

export const useData = () => {
  const v = useContext(Ctx)
  if (!v) throw new Error('useData must be used inside FiltersProvider')
  return v
}
