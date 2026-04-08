import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { loginUser } from '@/services/auth.service'
import type { IAuthResponse } from '@/interfaces/auth'

const mockResponse: IAuthResponse = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  gender: 'male',
  image: 'https://example.com/img.png',
  accessToken: 'tok123',
  refreshToken: 'refresh123',
}

function makeFetchMock(status: number, body: unknown, statusText = '') {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    statusText,
    json: () => Promise.resolve(body),
  })
}

describe('loginUser', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', makeFetchMock(200, mockResponse))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns the auth response on successful login', async () => {
    const result = await loginUser({ username: 'testuser', password: 'pass' })
    expect(result).toEqual(mockResponse)
  })

  it('sends a POST request with correct Content-Type header', async () => {
    const fetchSpy = makeFetchMock(200, mockResponse)
    vi.stubGlobal('fetch', fetchSpy)

    await loginUser({ username: 'u', password: 'p' })

    const [, init] = fetchSpy.mock.calls[0] as [string, RequestInit]
    expect(init.method).toBe('POST')
    expect((init.headers as Record<string, string>)['Content-Type']).toBe('application/json')
  })

  it('sends username, password, and default expiresInMins in body', async () => {
    const fetchSpy = makeFetchMock(200, mockResponse)
    vi.stubGlobal('fetch', fetchSpy)

    await loginUser({ username: 'u', password: 'p' })

    const [, init] = fetchSpy.mock.calls[0] as [string, RequestInit]
    const body = JSON.parse(init.body as string)
    expect(body.username).toBe('u')
    expect(body.password).toBe('p')
    expect(body.expiresInMins).toBe(30)
  })

  it('sends custom expiresInMins when provided', async () => {
    const fetchSpy = makeFetchMock(200, mockResponse)
    vi.stubGlobal('fetch', fetchSpy)

    await loginUser({ username: 'u', password: 'p', expiresInMins: 60 })

    const [, init] = fetchSpy.mock.calls[0] as [string, RequestInit]
    const body = JSON.parse(init.body as string)
    expect(body.expiresInMins).toBe(60)
  })

  it('throws IApiError with message from response body on HTTP error', async () => {
    vi.stubGlobal('fetch', makeFetchMock(401, { message: 'Invalid credentials' }, 'Unauthorized'))

    await expect(loginUser({ username: 'bad', password: 'bad' })).rejects.toMatchObject({
      status: 401,
      message: 'Invalid credentials',
    })
  })

  it('falls back to statusText when response body has no message', async () => {
    vi.stubGlobal('fetch', makeFetchMock(500, {}, 'Internal Server Error'))

    await expect(loginUser({ username: 'u', password: 'p' })).rejects.toMatchObject({
      status: 500,
      message: 'Internal Server Error',
    })
  })
})
