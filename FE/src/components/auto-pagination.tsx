import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

const RANGE = 2

interface Props {
  pageSize: number
  pathname?: string
  isLink?: boolean
  onClick?: (pageNumber: number) => void
}

export default function AutoPagination({ pageSize, pathname = '/', isLink = true, onClick = () => {} }: Props) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [page, setPage] = useState(1)

  useEffect(() => {
    const pageFromUrl = Number(searchParams.get('page')) || 1
    setPage(pageFromUrl)
  }, [searchParams])

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > pageSize) return
    setPage(pageNumber)
    if (!isLink) onClick(pageNumber)
    navigate(`${pathname}?page=${pageNumber}`)
  }

  const renderPagination = () => {
    let dotAfter = false
    let dotBefore = false

    const renderDotBefore = () => {
      if (!dotBefore) {
        dotBefore = true
        return (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )
      }
      return null
    }

    const renderDotAfter = () => {
      if (!dotAfter) {
        dotAfter = true
        return (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )
      }
      return null
    }

    return Array.from({ length: pageSize }, (_, index) => {
      const pageNumber = index + 1

      if (page <= RANGE * 2 + 1 && pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
        return renderDotAfter()
      } else if (page > RANGE * 2 + 1 && page < pageSize - RANGE * 2) {
        if (pageNumber < page - RANGE && pageNumber > RANGE) {
          return renderDotBefore()
        } else if (pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
          return renderDotAfter()
        }
      } else if (page >= pageSize - RANGE * 2 && pageNumber > RANGE && pageNumber < page - RANGE) {
        return renderDotBefore()
      }

      return (
        <PaginationItem key={pageNumber}>
          {isLink ? (
            <PaginationLink to={`${pathname}?page=${pageNumber}`} isActive={pageNumber === page}>
              {pageNumber}
            </PaginationLink>
          ) : (
            <Button
              onClick={() => handlePageChange(pageNumber)}
              variant={pageNumber === page ? 'outline' : 'ghost'}
              className='w-9 h-9 p-0'
            >
              {pageNumber}
            </Button>
          )}
        </PaginationItem>
      )
    })
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          {isLink ? (
            <PaginationPrevious
              to={`${pathname}?page=${page - 1}`}
              className={cn({ 'cursor-not-allowed': page === 1 })}
              onClick={(e) => {
                if (page === 1) e.preventDefault()
              }}
            />
          ) : (
            <Button
              disabled={page === 1}
              className='h-9 p-0 px-2'
              variant='ghost'
              onClick={() => handlePageChange(page - 1)}
            >
              <ChevronLeft className='w-5 h-5' />
              Previous
            </Button>
          )}
        </PaginationItem>

        {renderPagination()}

        <PaginationItem>
          {isLink ? (
            <PaginationNext
              to={`${pathname}?page=${page + 1}`}
              className={cn({ 'cursor-not-allowed': page === pageSize })}
              onClick={(e) => {
                if (page === pageSize) e.preventDefault()
              }}
            />
          ) : (
            <Button
              disabled={page === pageSize}
              className='h-9 p-0 px-2'
              variant='ghost'
              onClick={() => handlePageChange(page + 1)}
            >
              Next
              <ChevronRight className='w-5 h-5' />
            </Button>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
