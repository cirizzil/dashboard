// src/api/pnid.ts
import { api } from './client'
import { pollJob } from './poll'

// Example shape – adjust to match real API
export type PNIDData = {
  equipments?: { id: string; type?: string; material?: string }[]
  instruments?: { id: string; type?: string; material?: string }[]
  lines?: { id: string; type?: string; material?: string; size?: string | number }[]
}

export async function processPNIDFile(file: File, options?: Record<string, any>): Promise<PNIDData> {
  const form = new FormData()
  form.append('file', file)
  if (options) form.append('options', JSON.stringify(options))

  // NOTE: with axios + FormData, you can omit Content-Type; axios sets the multipart boundary.
  const { data } = await api.post<PNIDData>('/pnid:process', form)
  return data
}

export async function processPNIDUrl(fileUrl: string, options?: Record<string, any>): Promise<PNIDData> {
  const { data } = await api.post<PNIDData>('/pnid:process', { fileUrl, options })
  return data
}

export async function submitPNIDJob(fileUrl: string, options?: Record<string, any>) {
  const { data } = await api.post<{ batchId: string; jobIds: string[] }>(
    '/batch:submit',
    { jobs: [{ kind: 'pnid', fileUrl }], options }
  )
  const jobId = data.jobIds?.[0]
  if (!jobId) throw new Error('No jobId returned')
  return pollJob<PNIDData>(jobId) // resolves when job succeeds or throws on failure/timeout
}
