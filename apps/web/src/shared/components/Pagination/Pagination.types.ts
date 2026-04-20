export interface PaginationProps {
    page: number
    pageSize: number
    total: number
    pageSizeOptions?: number[]
    disabled?: boolean
}

export type PaginationChange = {
    page: number
    pageSize: number
    reason: 'page' | 'pageSize'
}

export type PageItem = number | '...'