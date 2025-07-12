import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState
} from '@tanstack/react-table'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { useState, createContext, useContext, useEffect, useMemo } from 'react'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Plus } from 'lucide-react'
import { useAppDispatch } from '@/utils/redux/hooks'
import { IListDataResponse } from '@/utils/interface/base'
import { IQueryBase } from '@/utils/interface/common'
import {
  DEFAULT_CURRENT_PAGE,
  DEFAULT_LIMIT_PAGE,
  EMPTY_STRING,
  NUMBER_ONE,
  NUMBER_ZERO
} from '@/utils/constants/common'
import useDebounce from '@/utils/hooks/useDebounce'
import FormAbout from './FormSlide'
import { useSelector } from 'react-redux'
import {
  AutoPagination,
  Button,
  DialogDelete,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  LoadingData,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/common'
import { TFunction } from 'i18next'
import { TranslationEnum } from '@/utils/enum/common'
import { IListSlide } from '@/utils/interface/slide'
import { slideActions, selectIsRefreshSlideList } from '@/thunks/slide/slideSlice'
import { deleteSlide, getListSlides } from '@/thunks/slide/slideThunk'

const TableContext = createContext({
  setTableIdEdit: (_: string) => {},
  tableIdEdit: EMPTY_STRING,
  tableIdDelete: EMPTY_STRING,
  setTableIdDelete: (_: string) => {},
  setIsOpen: (_: boolean) => {},
  isOpen: false
})

export const columns = (t: TFunction<TranslationEnum.TRANSLATION>): ColumnDef<IListSlide>[] => [
  {
    accessorKey: 'MaSlide',
    header: t('slide_page_table_id'),
    cell: ({ row }) => <div className='capitalize'>{row.getValue('MaSlide')}</div>
  },
  {
    accessorKey: 'Anh',
    header: t('slide_page_table_image'),
    cell: ({ row }) => {
      const imageUrl = row.getValue('Anh') as string
      const fullUrl = `http://localhost:8080/images/slide/${imageUrl}`

      return (
        <Avatar>
          <AvatarImage className='w-12 h-12 rounded-md' src={fullUrl} alt='Hình ảnh' />
          <AvatarFallback>{EMPTY_STRING}</AvatarFallback>
        </Avatar>
      )
    }
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const { setTableIdEdit, setTableIdDelete, setIsOpen } = useContext(TableContext)
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <DotsHorizontalIcon className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setTableIdEdit(row.original.MaSlide)
                setIsOpen(true)
              }}
            >
              Sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setTableIdDelete(row.original.MaSlide)
              }}
            >
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

export default function SlideTable() {
  const loadingContext = useContext(LoadingData)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const isRefresh = useSelector(selectIsRefreshSlideList)
  const pageFromParams = useMemo(() => Number(searchParams.get('page')) || DEFAULT_CURRENT_PAGE, [searchParams])

  const [tableIdEdit, setTableIdEdit] = useState<string>(EMPTY_STRING)
  const [tableIdDelete, setTableIdDelete] = useState<string>(EMPTY_STRING)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [pagination, setPagination] = useState({
    pageIndex: pageFromParams - 1,
    pageSize: DEFAULT_LIMIT_PAGE
  })
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [data, setData] = useState<IListSlide[]>([])
  const [total, setTotal] = useState<number>(0)
  const [paramObject, setParamObject] = useState<IQueryBase>({
    current: pageFromParams,
    pageSize: DEFAULT_LIMIT_PAGE
  })

  const table = useReactTable({
    data,
    columns: columns(t),
    pageCount: Math.ceil(total / pagination.pageSize),
    manualPagination: true,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility
    },

    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  })

  // Update paramObject khi page thay đổi
  useEffect(() => {
    const newPage = pagination.pageIndex + 1
    setParamObject((prev) => ({
      ...prev,
      current: newPage
    }))
    const updatedParams = new URLSearchParams(searchParams)
    updatedParams.set('page', String(newPage))
    setSearchParams(updatedParams)
  }, [pagination.pageIndex])

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: pageFromParams - DEFAULT_CURRENT_PAGE
    }))
  }, [searchParams])

  useEffect(() => {
    getList(paramObject)
  }, [paramObject])

  useEffect(() => {
    if (isRefresh) {
      getList(paramObject)
      dispatch(slideActions.setRefreshList(false))
    }
  }, [isRefresh])

  const getList = (payload: IQueryBase) => {
    loadingContext?.show()
    dispatch(getListSlides(payload))
      .unwrap()
      .then((res) => {
        const { result, meta }: IListDataResponse<IListSlide[]> = res?.data
        setData(result)
        setTotal(meta.total || NUMBER_ZERO)
        setPagination({
          pageIndex: (meta.current ?? DEFAULT_CURRENT_PAGE) - 1,
          pageSize: meta.pageSize ?? DEFAULT_LIMIT_PAGE
        })
      })
      .catch(() => {
        toast.error('Lỗi khi tải danh sách!')
      })
      .finally(() => {
        loadingContext?.hide()
      })
  }

  const handleCreate = () => {
    setIsOpen(true)
  }
  const handleToggleForm = () => setIsOpen(!isOpen)
  const handleDelete = () => {
    if (!tableIdDelete) return
    dispatch(deleteSlide(tableIdDelete))
      .unwrap()
      .then(() => {
        if (data.length === NUMBER_ONE && pagination.pageIndex > NUMBER_ZERO) {
          setPagination((prev) => ({
            ...prev,
            pageIndex: prev.pageIndex - NUMBER_ONE
          }))
        }
        dispatch(slideActions.setRefreshList(true))
      })
      .finally(() => {
        handleCloseModalDelete()
      })
  }

  const handleCloseModalDelete = () => {
    setTableIdDelete(EMPTY_STRING)
  }

  return (
    <TableContext.Provider
      value={{
        tableIdEdit,
        setTableIdEdit,
        tableIdDelete,
        setTableIdDelete,
        isOpen,
        setIsOpen
      }}
    >
      <div className='w-full'>
        <div className='flex items-center py-4'>
          <div className='ml-auto flex items-center gap-2'>
            <Button onClick={handleCreate}>
              <Plus className='w-4 h-4' />
              {t('common_add_new')}
            </Button>
          </div>
        </div>

        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((group) => (
                <TableRow key={group.id}>
                  {group.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={table.getAllColumns().length} className='h-24 text-center text-gray-500'>
                    {t('common_no_results')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className='flex items-center justify-end space-x-2 py-4'>
          <div className='text-xs text-muted-foreground py-4 flex-1'>
            Hiển thị <strong>{table.getPaginationRowModel().rows.length}</strong> trong <strong>{data.length}</strong>{' '}
            kết quả
          </div>
          <div>
            {table.getRowModel().rows.length > 0 && (
              <AutoPagination pageSize={table.getPageCount()} pathname='/admin/slide' />
            )}
          </div>
        </div>
      </div>

      <FormAbout id={tableIdEdit} setId={setTableIdEdit} isOpen={isOpen} onClose={handleToggleForm} />

      <DialogDelete onConfirm={handleDelete} tableIdDelete={tableIdDelete} setTableIdDelete={setTableIdDelete} />
    </TableContext.Provider>
  )
}
