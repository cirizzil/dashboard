// src/api/client.ts
import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'

export const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    Authorization: 'Bearer idsv-dashboard-demo-2025',
    Accept: 'application/json',
  },
})

export const directApi = axios.create({
  baseURL: 'https://testing.asets.io/convert/v1',
  timeout: 30000,
  headers: {
    Authorization: 'Bearer idsv-dashboard-demo-2025',
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const url = (config.baseURL || '') + (config.url || '')
  console.debug('[API REQUEST]', config.method?.toUpperCase(), url)
  return config
})

api.interceptors.response.use(
  (res) => {
    console.debug('[API RESPONSE]', res.status, res.config.url)
    return res
  },
  (err) => {
    const status = err?.response?.status
    const url = err?.config?.url
    console.warn('[API ERROR]', status, url, err?.message)
    return Promise.reject(err)
  }
)

export async function postJsonWithFallback<T>(path: string, body: any, config?: AxiosRequestConfig) {
  try {
    const r = await api.post<T>(path, body, { headers: { 'Content-Type': 'application/json' }, ...(config || {}) })
    return r.data
  } catch (e: any) {
    if (e?.response?.status === 404) {
      const r = await directApi.post<T>(path, body, { headers: { 'Content-Type': 'application/json' }, ...(config || {}) })
      return r.data
    }
    throw e
  }
}

export async function getWithFallback<T>(path: string, config?: AxiosRequestConfig) {
  try {
    const r = await api.get<T>(path, config)
    return r.data
  } catch (e: any) {
    if (e?.response?.status === 404) {
      const r = await directApi.get<T>(path, config)
      return r.data
    }
    throw e
  }
}
