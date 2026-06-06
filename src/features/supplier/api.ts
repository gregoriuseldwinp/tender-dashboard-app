import { apiFetch } from '../../lib/api'
import type { Tender, Proposal, NegotiationMessage } from '../buyer/api'

export type { Tender, Proposal, NegotiationMessage }

export interface CreateProposalPayload {
  title: string
  description: string
  priceOffer?: number
  estimatedDeliveryTime?: string
  termsAndConditions?: string
}

export const supplierApi = {
  getTenders: () => apiFetch<Tender[]>('/supplier/tenders'),
  getTender: (id: string) => apiFetch<Tender>(`/supplier/tenders/${id}`),
  createProposal: (tenderId: string, data: CreateProposalPayload) =>
    apiFetch<Proposal>(`/supplier/tenders/${tenderId}/proposals`, 'POST', data),
  getProposals: () => apiFetch<Proposal[]>('/supplier/proposals'),
  getProposal: (id: string) => apiFetch<Proposal>(`/supplier/proposals/${id}`),
  updateProposal: (id: string, data: Partial<CreateProposalPayload>) =>
    apiFetch<Proposal>(`/supplier/proposals/${id}`, 'PATCH', data),
  withdrawProposal: (id: string) => apiFetch<Proposal>(`/supplier/proposals/${id}/withdraw`, 'PATCH'),
  getNegotiations: (proposalId: string) => apiFetch<NegotiationMessage[]>(`/supplier/proposals/${proposalId}/negotiations`),
  sendNegotiation: (proposalId: string, message: string) =>
    apiFetch<NegotiationMessage>(`/supplier/proposals/${proposalId}/negotiations`, 'POST', { message }),
}
