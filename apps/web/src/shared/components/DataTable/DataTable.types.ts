export interface Column {
    key: string
    label: string
    sortable?: boolean
    width?: string
    align?: 'left' | 'center' | 'right'
    hideable?: boolean
    render?: (value: any, row: any) => unknown
}

export interface DataTableProps {
    columns: Column[]
    data: any[]
    loading?: boolean
}

export type SortOrder = 'asc' | 'desc'

export type SortState = {
    sortBy?: string
    sortOrder?: SortOrder
}
