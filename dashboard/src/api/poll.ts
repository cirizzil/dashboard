import { api } from './client'

export async function pollJob<T>(jobId: string, { intervalMs = 1500, timeoutMs = 10 * 60_000 } = {}): Promise<T> {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    const { data } = await api.get<{ status: 'queued' | 'processing' | 'succeeded' | 'failed'; result?: T }>(`/jobs/${jobId}`)
    if (data.status === 'succeeded' && data.result) return data.result
    if (data.status === 'failed') throw new Error(`Job ${jobId} failed`)
    await new Promise(r => setTimeout(r, intervalMs))
  }
  throw new Error('Polling timed out')
}
