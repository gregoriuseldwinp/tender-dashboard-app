import { z } from 'zod'

export const roleSchema = z.object({
  name: z.string().min(1, 'Nama role wajib diisi'),
  description: z.string().optional(),
})

export type RoleForm = z.infer<typeof roleSchema>
