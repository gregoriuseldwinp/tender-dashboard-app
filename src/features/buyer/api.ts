import { apiFetch } from '../../lib/api'

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
  createdAt: string
  updatedAt: string
}

export interface ProposalSupplier {
  id: string
  companyName: string
  legalName?: string
  email?: string
  phone?: string
  address?: string
}

export interface ProposalSubmittedBy {
  id: string
  name: string
  email: string
}

export interface Proposal {
  id: string
  title: string
  description: string
  priceOffer?: number
  estimatedDeliveryTime?: string
  termsAndConditions?: string
  status: 'submitted' | 'under_review' | 'shortlisted' | 'rejected' | 'accepted' | 'withdrawn'
  supplier?: ProposalSupplier | null
  submittedBy?: ProposalSubmittedBy | null
  tender?: Partial<Tender>
  createdAt: string
  updatedAt: string
}

export interface NegotiationSender {
  userId: string
  name: string | null
  accountId: string
  companyName: string | null
  accountType: 'buyer' | 'supplier' | 'internal'
}

export interface NegotiationMessage {
  id: string
  proposalId?: string
  senderAccountType: 'buyer' | 'supplier' | 'internal'
  message: string
  sender: NegotiationSender
  createdAt: string
  updatedAt?: string
}

export interface CreateTenderPayload {
  title: string
  description: string
  needs: string
  openTender: boolean
  category?: string
  budgetEstimate?: number
  deadline?: string
  deliveryLocation?: string
}

export const buyerApi = {
  getTenders: () => apiFetch<Tender[]>('/buyer/tenders'),
  getTender: (id: string) => apiFetch<Tender>(`/buyer/tenders/${id}`),
  createTender: (data: CreateTenderPayload) => apiFetch<Tender>('/buyer/tenders', 'POST', data),
  updateTender: (id: string, data: Partial<CreateTenderPayload>) => apiFetch<Tender>(`/buyer/tenders/${id}`, 'PATCH', data),
  deleteTender: (id: string) => apiFetch(`/buyer/tenders/${id}`, 'DELETE'),
  getTenderProposals: (tenderId: string) => apiFetch<Proposal[]>(`/buyer/tenders/${tenderId}/proposals`),
  getProposal: (id: string) => apiFetch<Proposal>(`/buyer/proposals/${id}`),
  shortlistProposal: (id: string) => apiFetch<Proposal>(`/buyer/proposals/${id}/shortlist`, 'PATCH'),
  rejectProposal: (id: string) => apiFetch<Proposal>(`/buyer/proposals/${id}/reject`, 'PATCH'),
  acceptProposal: (id: string) => apiFetch<Proposal>(`/buyer/proposals/${id}/accept`, 'PATCH'),
  getNegotiations: (proposalId: string) => apiFetch<NegotiationMessage[]>(`/buyer/proposals/${proposalId}/negotiations`),
  sendNegotiation: (proposalId: string, message: string) =>
    apiFetch<NegotiationMessage>(`/buyer/proposals/${proposalId}/negotiations`, 'POST', { message }),
}
