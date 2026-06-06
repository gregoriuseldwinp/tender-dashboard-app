import { createFileRoute } from '@tanstack/react-router'
import { RegisterSupplierPage } from '../../features/auth/pages/register-supplier-page'

export const Route = createFileRoute('/register/supplier')({
  component: RegisterSupplierPage,
})
