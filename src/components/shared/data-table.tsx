import { type ReactNode } from 'react'
import { Table, Thead, Tbody, Tr, Th, Td } from '../ui/table'
import { SkeletonTable } from '../ui/skeleton'
import { EmptyState } from './empty-state'

export interface Column<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  emptyTitle?: string
  emptyDescription?: string
  emptyAction?: ReactNode
  keyExtractor: (row: T) => string
  mobileRender?: (row: T) => ReactNode
}

export function DataTable<T>({
  columns,
  data,
  loading,
  emptyTitle = 'Tidak ada data',
  emptyDescription,
  emptyAction,
  keyExtractor,
  mobileRender,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div>
        <div className="hidden md:block">
          <SkeletonTable />
        </div>
        <div className="md:hidden space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />
    )
  }

  return (
    <div>
      {/* Desktop table */}
      <div className="hidden md:block">
        <Table>
          <Thead>
            <Tr>
              {columns.map(col => (
                <Th key={col.key} className={col.className}>{col.header}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {data.map(row => (
              <Tr key={keyExtractor(row)}>
                {columns.map(col => (
                  <Td key={col.key} className={col.className}>{col.render(row)}</Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {data.map(row => (
          <div key={keyExtractor(row)} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            {mobileRender
              ? mobileRender(row)
              : columns.map(col => (
                  <div key={col.key} className="flex justify-between items-start py-1 text-sm">
                    <span className="text-gray-500 font-medium shrink-0 mr-4">{col.header}</span>
                    <span className="text-gray-800 text-right">{col.render(row)}</span>
                  </div>
                ))}
          </div>
        ))}
      </div>
    </div>
  )
}
