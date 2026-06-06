import { QueryClient } from '@tanstack/react-query'
import { UnauthorizedError } from '../lib/api'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error instanceof UnauthorizedError) return false
        return failureCount < 2
      },
      staleTime: 1000 * 30,
    },
  },
})
