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
import FormBrand from './FormBrand'
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
  Input,
  LoadingData,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/common'
import { TFunction } from 'i18next'
import { IListBrand } from '@/utils/interface/brand'
import { deleteBrand, getListBrand } from '@/thunks/brand/brandThunk'
import { brandActions, selectIsRefreshBrandList } from '@/thunks/brand/brandSlice'
import { TranslationEnum } from '@/utils/enum/common'

const BrandTableContext = createContext({
  setTableIdEdit: (_: string) => {},
  tableIdEdit: EMPTY_STRING,
  tableIdDelete: EMPTY_STRING,
  setTableIdDelete: (_: string) => {},
  setIsOpen: (_: boolean) => {},
  isOpen: false
})

export const columns = (t: TFunction<TranslationEnum.TRANSLATION>): ColumnDef<IListBrand>[] => [
  {
    accessorKey: 'MaThuongHieu',
    header: t('brand_page_table_id'),
    cell: ({ row }) => <div className='capitalize'>{row.getValue('MaThuongHieu')}</div>
  },
  {
    accessorKey: 'TenThuongHieu',
    header: t('brand_page_table_name'),
    cell: ({ row }) => <div className='capitalize'>{row.getValue('TenThuongHieu')}</div>
  },
  {
    accessorKey: 'GioiThieu',
    header: t('brand_page_table_description'),
    cell: ({ row }) => <div className='capitalize'>{row.getValue('GioiThieu')}</div>
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const { setTableIdEdit, setTableIdDelete, setIsOpen } = useContext(BrandTableContext)
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
                setTableIdEdit(row.original.MaThuongHieu)
                setIsOpen(true)
              }}
            >
              Sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setTableIdDelete(row.original.MaThuongHieu)
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

export default function BrandTable() {
  const loadingContext = useContext(LoadingData)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const isRefresh = useSelector(selectIsRefreshBrandList)
  const pageFromParams = useMemo(() => Number(searchParams.get('page')) || DEFAULT_CURRENT_PAGE, [searchParams])
  const [filterName, setFilterName] = useState(EMPTY_STRING)
  const debouncedFilterName = useDebounce(filterName, 1000)

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
  const [data, setData] = useState<IListBrand[]>([])
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
    const pageFromUrl = Number(searchParams.get('page')) || DEFAULT_CURRENT_PAGE
    setPagination((prev) => ({
      ...prev,
      pageIndex: pageFromUrl - DEFAULT_CURRENT_PAGE
    }))
  }, [searchParams])

  useEffect(() => {
    const currentSearchKey = searchParams.get('searchKey') || EMPTY_STRING

    if (currentSearchKey === debouncedFilterName) return

    const updatedParams = new URLSearchParams(searchParams)
    if (debouncedFilterName) {
      updatedParams.set('searchKey', debouncedFilterName)
    } else {
      updatedParams.delete('searchKey')
    }
    updatedParams.set('page', '1')
    setSearchParams(updatedParams)

    setPagination((prev) => ({
      ...prev,
      pageIndex: 0
    }))

    setParamObject((prev) => ({
      ...prev,
      current: 1,
      ...(debouncedFilterName ? { searchKey: debouncedFilterName } : { searchKey: undefined })
    }))
  }, [debouncedFilterName, searchParams])

  useEffect(() => {
    getList(paramObject)
  }, [paramObject])

  useEffect(() => {
    if (isRefresh) {
      getList(paramObject)
      dispatch(brandActions.setRefreshList(false))
    }
  }, [isRefresh])

  const getList = (payload: IQueryBase) => {
    loadingContext?.show()
    dispatch(getListBrand(payload))
      .unwrap()
      .then((res) => {
        const { result, meta }: IListDataResponse<IListBrand[]> = res?.data
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
    dispatch(deleteBrand(tableIdDelete))
      .unwrap()
      .then(() => {
        if (data.length === NUMBER_ONE && pagination.pageIndex > NUMBER_ZERO) {
          setPagination((prev) => ({
            ...prev,
            pageIndex: prev.pageIndex - NUMBER_ONE
          }))
        }
        dispatch(brandActions.setRefreshList(true))
      })
      .finally(() => {
        handleCloseModalDelete()
      })
  }

  const handleCloseModalDelete = () => {
    setTableIdDelete(EMPTY_STRING)
  }

  return (
    <BrandTableContext.Provider
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
          <Input
            placeholder={t('brand_page_placeholder_input')}
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className='max-w-sm'
          />
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
              <AutoPagination pageSize={table.getPageCount()} pathname='/admin/brand' />
            )}
          </div>
        </div>
      </div>

      <FormBrand id={tableIdEdit} setId={setTableIdEdit} isOpen={isOpen} onClose={handleToggleForm} />

      <DialogDelete onConfirm={handleDelete} tableIdDelete={tableIdDelete} setTableIdDelete={setTableIdDelete} />
    </BrandTableContext.Provider>
  )
}
