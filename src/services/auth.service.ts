import type { IAuthRequest, IAuthResponse } from '@/interfaces/auth'
import type { IApiError } from '@/interfaces/post'
import { authLoginEndpoint } from './auth.endpoints'

export async function loginUser(credentials: IAuthRequest): Promise<IAuthResponse> {
  const response = await fetch(authLoginEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: credentials.username,
      password: credentials.password,
      expiresInMins: credentials.expiresInMins ?? 30,
    }),
  })
  if (!response.ok) {
    let message = response.statusText
    try {
      const body = await response.json()
      if (typeof body?.message === 'string' && body.message) message = body.message
    } catch {
      // ignore parse errors, fall back to statusText
    }
    const err: IApiError = { status: response.status, message: message || `HTTP ${response.status}` }
    throw err
  }
  return response.json() as Promise<IAuthResponse>
}
