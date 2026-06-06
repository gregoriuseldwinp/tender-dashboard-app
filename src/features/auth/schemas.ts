import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
})

export const registerSchema = z.object({
  companyName: z.string().min(1, 'Nama perusahaan wajib diisi'),
  legalName: z.string().optional(),
  email: z.string().email('Format email tidak valid').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  ownerName: z.string().min(1, 'Nama pemilik wajib diisi'),
  ownerEmail: z.string().min(1, 'Email pemilik wajib diisi').email('Format email tidak valid'),
  ownerPassword: z.string().min(8, 'Password minimal 8 karakter'),
})

export type LoginForm = z.infer<typeof loginSchema>
export type RegisterForm = z.infer<typeof registerSchema>
