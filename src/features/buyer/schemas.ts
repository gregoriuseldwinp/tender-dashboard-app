import { z } from 'zod'

export const tenderSchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter'),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  needs: z.string().min(5, 'Kebutuhan minimal 5 karakter'),
  openTender: z.boolean().default(true),
  category: z.string().optional(),
  budgetEstimate: z.union([z.string(), z.number()]).optional(),
  deadline: z.string().optional(),
  deliveryLocation: z.string().optional(),
})

export type TenderForm = z.infer<typeof tenderSchema>
