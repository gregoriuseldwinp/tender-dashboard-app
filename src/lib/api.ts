import { API_BASE_URL } from './constants'

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends Error {
  constructor(message = 'Forbidden') {
    super(message)
    this.name = 'ForbiddenError'
  }
}

export class ConflictError extends Error {
  constructor(message = 'Conflict') {
    super(message)
    this.name = 'ConflictError'
  }
}

export class ApiError extends Error {
  public errors?: Record<string, string[]>
  public status: number

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE'

export async function apiFetch<T>(
  path: string,
  method: HttpMethod = 'GET',
  body?: unknown,
): Promise<T> {
  const url = `${API_BASE_URL}${path}`

  const headers: Record<string, string> = {}
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(url, {
    method,
    credentials: 'include',
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (res.status === 401) throw new UnauthorizedError()
  if (res.status === 403) throw new ForbiddenError()
  if (res.status === 409) {
    const json = await res.json().catch(() => ({}))
    throw new ConflictError(json.message ?? 'Conflict')
  }

  const json = await res.json().catch(() => null)

  if (!res.ok) {
    throw new ApiError(
      json?.message ?? 'Terjadi kesalahan',
      res.status,
      json?.errors,
    )
  }

  return json?.data as T
}
