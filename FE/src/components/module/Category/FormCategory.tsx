import { TFunction } from 'i18next'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { useContext, useEffect, useState, Dispatch, SetStateAction } from 'react'

import { IAddCategoryReq, IListCategory, IUpdateCategory } from '@/utils/interface/category'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { LoadingData } from '@/components/common'

import { EMPTY_STRING } from '@/utils/constants/common'
import { useAppDispatch } from '@/utils/redux/hooks'
import { compareDataUpdate } from '@/utils/helper/common'

import { createCategory, getCategoryDetails, updateCategory } from '@/thunks/category/categoryThunk'
import { categoryActions } from '@/thunks/category/categorySlice'

type Props = {
  isOpen: boolean
  id: string
  setId: Dispatch<SetStateAction<string>>
  onClose: () => void
}

const schema = (t: TFunction) =>
  z.object({
    TenLoaiSanPham: z.string().trim().min(1, t('common_validate_require_field')),
    GioiThieu: z.string().optional()
  })

const FormCategory = (props: Props) => {
  const { id, setId, isOpen, onClose } = props

  const { t } = useTranslation()
  const form = useForm<IAddCategoryReq>({
    resolver: zodResolver(schema(t)),
    defaultValues: {
      TenLoaiSanPham: EMPTY_STRING,
      GioiThieu: EMPTY_STRING
    }
  })
  const loadingContext = useContext(LoadingData)
  const dispatch = useAppDispatch()

  const [dataOriginal, setDataOriginal] = useState<IListCategory>()

  useEffect(() => {
    if (!id) {
      form.reset({
        TenLoaiSanPham: EMPTY_STRING,
        GioiThieu: EMPTY_STRING
      })
      return
    }

    handleDetailCategory(id)
  }, [id])

  const handleDetailCategory = (id: string) => {
    if (!id) return

    loadingContext?.show()

    dispatch(getCategoryDetails(id))
      .unwrap()
      .then((res) => {
        const { data } = res

        form.reset({
          TenLoaiSanPham: data?.TenLoaiSanPham || EMPTY_STRING,
          GioiThieu: data?.GioiThieu || EMPTY_STRING
        })
        setDataOriginal(data)
      })
      .catch((error) => {})
      .finally(() => {
        loadingContext?.hide()
      })
  }

  const reset = () => {
    form.reset()
    setId(EMPTY_STRING)
    onClose()
  }

  const onSubmit = (data: IAddCategoryReq) => {
    if (id) {
      const payload: IUpdateCategory = {
        ...data,
        MaLoaiSanPham: id
      }

      return handeleEditCategory(payload)
    } else {
      return handCreateCategory(data)
    }
  }

  const handeleEditCategory = (data: IAddCategoryReq) => {
    if (!id) return

    const dataChange = compareDataUpdate(dataOriginal as IListCategory, data)

    const finalPayload = {
      MaLoaiSanPham: id,
      ...(dataChange as Partial<IUpdateCategory>)
    } as IUpdateCategory

    loadingContext?.show()

    dispatch(updateCategory(finalPayload))
      .unwrap()
      .then(() => {
        reset()
        return dispatch(categoryActions.setRefreshList(true))
      })
      .catch((error) => {
        // handle error nếu cần
      })
      .finally(() => {
        loadingContext?.hide()
      })
  }

  const handCreateCategory = (payload: IAddCategoryReq) => {
    loadingContext?.show()

    dispatch(createCategory(payload))
      .unwrap()
      .then(() => {
        reset()
        return dispatch(categoryActions.setRefreshList(true))
      })
      .catch((error) => {
        // handle error nếu cần
      })
      .finally(() => {
        loadingContext?.hide()
      })
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(value) => {
        if (!value) {
          reset()
        }
      }}
    >
      <DialogContent
        className=' sm:max-w-[600px] max-h-screen overflow-auto'
        onCloseAutoFocus={() => {
          form.reset()
          setId(EMPTY_STRING)
        }}
      >
        <DialogHeader>
          <DialogTitle>{id ? t('common_update') : t('common_add_new')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className='grid auto-rows-max items-start gap-4 md:gap-8'
            onSubmit={form.handleSubmit(onSubmit, console.log)}
            id='table-form'
          >
            <div className='grid gap-4 py-4'>
              <FormField
                control={form.control}
                name='TenLoaiSanPham'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex flex-col gap-2'>
                      <Label htmlFor='number'>
                        {t('category_page_table_name')}
                        <span className='text-red-500'>*</span>
                      </Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input id='number' type='text' className='w-full' {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='GioiThieu'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex flex-col gap-2'>
                      <Label> {t('category_page_table_description')}</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Textarea
                          id='capacity'
                          className='w-full break-words break-all resize-none max-h-40 overflow-auto'
                          {...field}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button
            type='submit'
            form='table-form'
            className='cursor-pointer'
            disabled={id ? !form.formState.isDirty : false}
          >
            {t('common_btn_save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default FormCategory
