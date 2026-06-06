import { z } from 'zod'

export const proposalSchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter'),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  priceOffer: z.union([z.string(), z.number()]).optional(),
  estimatedDeliveryTime: z.string().optional(),
  termsAndConditions: z.string().optional(),
})

export type ProposalForm = z.infer<typeof proposalSchema>
