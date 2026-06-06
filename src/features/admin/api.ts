import { apiFetch } from '../../lib/api'
import type { NegotiationMessage } from '../buyer/api'

export type { NegotiationMessage }

export interface Account {
  id: string
  companyName: string
  legalName?: string
  email?: string
  phone?: string
  address?: string
  accountType: 'buyer' | 'supplier' | 'internal'
  status: 'pending' | 'approved' | 'rejected' | 'suspended'
  rejectionReason?: string
  createdAt: string
  users?: Array<{ id: string; name: string; email: string }>
}

export interface TenderProposal {
  id: string
  title: string
  description: string
  priceOffer?: number
  estimatedDeliveryTime?: string
  status: string
  supplier?: { id: string; companyName: string; legalName?: string; email?: string; phone?: string } | null
  submittedBy?: { id: string; name: string; email: string } | null
  createdAt: string
}

export interface Tender {
  id: string
  title: string
  description: string
  needs: string
  category?: string
  budgetEstimate?: number
  deadline?: string
  deliveryLocation?: string
  openTender: boolean
  status: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'published' | 'closed' | 'cancelled'
  rejectionReason?: string
  account?: { id: string; companyName: string }
  buyer?: { id: string; companyName: string; legalName?: string | null; email?: string | null; phone?: string | null; address?: string | null } | null
  createdBy?: { id: string; name: string; email: string } | null
  proposalCount?: number
  proposals?: TenderProposal[]
  createdAt: string
}

export interface Permission {
  id: string
  name: string
  description?: string
}

export interface Role {
  id: string
  name: string
  description?: string
  isSystem: boolean
  permissions: Permission[]
}

export interface Proposal {
  id: string
  title: string
  description: string
  priceOffer?: number
  estimatedDeliveryTime?: string
  termsAndConditions?: string
  status: string
  supplier?: { id: string; companyName: string; legalName?: string; email?: string; phone?: string; address?: string } | null
  submittedBy?: { id: string; name: string; email: string } | null
  tender?: { id: string; title: string; category?: string; budgetEstimate?: number; deadline?: string; account?: { companyName: string } }
  createdAt: string
}

export const adminApi = {
  getPendingAccounts: () => apiFetch<Account[]>('/internal/accounts/pending'),
  getAccounts: () => apiFetch<Account[]>('/internal/accounts'),
  getAccount: (id: string) => apiFetch<Account>(`/internal/accounts/${id}`),
  approveAccount: (id: string) => apiFetch<Account>(`/internal/accounts/${id}/approve`, 'PATCH'),
  rejectAccount: (id: string, reason: string) => apiFetch<Account>(`/internal/accounts/${id}/reject`, 'PATCH', { reason }),
  suspendAccount: (id: string) => apiFetch<Account>(`/internal/accounts/${id}/suspend`, 'PATCH'),

  getPendingTenders: () => apiFetch<Tender[]>('/internal/tenders/pending'),
  getTenders: () => apiFetch<Tender[]>('/internal/tenders'),
  getTender: (id: string) => apiFetch<Tender>(`/internal/tenders/${id}`),
  approveTender: (id: string) => apiFetch<Tender>(`/internal/tenders/${id}/approve`, 'PATCH'),
  rejectTender: (id: string, reason: string) => apiFetch<Tender>(`/internal/tenders/${id}/reject`, 'PATCH', { reason }),
  closeTender: (id: string) => apiFetch<Tender>(`/internal/tenders/${id}/close`, 'PATCH'),
  cancelTender: (id: string) => apiFetch<Tender>(`/internal/tenders/${id}/cancel`, 'PATCH'),

  getProposal: (id: string) => apiFetch<Proposal>(`/internal/proposals/${id}`),
  getNegotiations: (proposalId: string) => apiFetch<NegotiationMessage[]>(`/internal/proposals/${proposalId}/negotiations`),

  getRoles: () => apiFetch<Role[]>('/internal/roles'),
  getPermissions: () => apiFetch<Permission[]>('/internal/permissions'),
  createRole: (data: { name: string; description?: string }) => apiFetch<Role>('/internal/roles', 'POST', data),
  updateRole: (id: string, data: { name: string; description?: string }) => apiFetch<Role>(`/internal/roles/${id}`, 'PATCH', data),
  deleteRole: (id: string) => apiFetch(`/internal/roles/${id}`, 'DELETE'),
  addPermission: (roleId: string, permissionId: string) =>
    apiFetch(`/internal/roles/${roleId}/permissions`, 'POST', { permissionId }),
  removePermission: (roleId: string, permissionId: string) =>
    apiFetch(`/internal/roles/${roleId}/permissions/${permissionId}`, 'DELETE'),
}
