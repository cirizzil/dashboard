// src/api/isometric.ts
import { api } from './client'
import { pollJob } from './poll'

// Example shape – adjust to real API
export type ISOData = {
  elements?: { id: string; type?: string; material?: string; lineId?: string | null }[]
}

export async function processISOFile(file: File, options?: Record<string, any>): Promise<ISOData> {
  const form = new FormData()
  form.append('file', file)
  if (options) form.append('options', JSON.stringify(options))
  const { data } = await api.post<ISOData>('/isometric:process', form)
  return data
}

export async function processISOUrl(fileUrl: string, options?: Record<string, any>): Promise<ISOData> {
  const { data } = await api.post<ISOData>('/isometric:process', { fileUrl, options })
  return data
}

export async function submitISOJob(fileUrl: string, options?: Record<string, any>) {
  const { data } = await api.post<{ batchId: string; jobIds: string[] }>(
    '/batch:submit',
    { jobs: [{ kind: 'isometric', fileUrl }], options }
  )
  const jobId = data.jobIds?.[0]
  if (!jobId) throw new Error('No jobId returned')
  return pollJob<ISOData>(jobId)
}
