import { apiFetch } from '../../lib/api'

export interface AuthUser {
  id: string
  name: string
  email: string
  account?: {
    id: string
    companyName: string
    accountType: 'buyer' | 'supplier' | 'internal'
    status: 'pending' | 'approved' | 'rejected' | 'suspended'
  }
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  companyName: string
  legalName?: string
  email?: string
  phone?: string
  address?: string
  ownerName: string
  ownerEmail: string
  ownerPassword: string
}

export const authApi = {
  login: (data: LoginPayload) => apiFetch<AuthUser>('/auth/login', 'POST', data),
  logout: () => apiFetch('/auth/logout', 'POST'),
  me: () => apiFetch<AuthUser>('/auth/me'),
  getPermissions: () => apiFetch<{ permissions: string[] }>('/auth/me/permissions'),
  registerBuyer: (data: RegisterPayload) => apiFetch<AuthUser>('/auth/register/buyer', 'POST', data),
  registerSupplier: (data: RegisterPayload) => apiFetch<AuthUser>('/auth/register/supplier', 'POST', data),
}
