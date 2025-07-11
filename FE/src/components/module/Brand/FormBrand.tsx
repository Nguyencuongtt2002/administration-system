import { TFunction } from 'i18next'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { useContext, useEffect, useState, Dispatch, SetStateAction } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { EMPTY_STRING } from '@/utils/constants/common'
import { useAppDispatch } from '@/utils/redux/hooks'
import { compareDataUpdate } from '@/utils/helper/common'

import { IAddBrandReq, IListBrand, IUpdateBrand } from '@/utils/interface/brand'
import { createBrand, getBrandDetails, updateBrand } from '@/thunks/brand/brandThunk'
import { brandActions } from '@/thunks/brand/brandSlice'
import {
  Button,
  LoadingData,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Form,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Label,
  Textarea
} from '@/components/common'

type Props = {
  isOpen: boolean
  id: string
  setId: Dispatch<SetStateAction<string>>
  onClose: () => void
}

const schema = (t: TFunction) =>
  z.object({
    TenThuongHieu: z.string().trim().min(1, t('common_validate_require_field')),
    GioiThieu: z.string().optional()
  })

const FormBrand = (props: Props) => {
  const { id, setId, isOpen, onClose } = props

  const { t } = useTranslation()
  const form = useForm<IAddBrandReq>({
    resolver: zodResolver(schema(t)),
    defaultValues: {
      TenThuongHieu: EMPTY_STRING,
      GioiThieu: EMPTY_STRING
    }
  })
  const loadingContext = useContext(LoadingData)
  const dispatch = useAppDispatch()

  const [dataOriginal, setDataOriginal] = useState<IListBrand>()

  useEffect(() => {
    if (!id) {
      form.reset({
        TenThuongHieu: EMPTY_STRING,
        GioiThieu: EMPTY_STRING
      })
      return
    }

    handleDetailBrand(id)
  }, [id])

  const handleDetailBrand = (id: string) => {
    if (!id) return

    loadingContext?.show()

    dispatch(getBrandDetails(id))
      .unwrap()
      .then((res) => {
        const { data } = res

        form.reset({
          TenThuongHieu: data?.TenThuongHieu || EMPTY_STRING,
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

  const onSubmit = (data: IAddBrandReq) => {
    if (id) {
      const payload: IUpdateBrand = {
        ...data,
        MaThuongHieu: id
      }

      return handeleEditBrand(payload)
    } else {
      return handCreateBrand(data)
    }
  }

  const handeleEditBrand = (data: IAddBrandReq) => {
    if (!id) return

    const dataChange = compareDataUpdate(dataOriginal as IListBrand, data)

    const finalPayload = {
      MaThuongHieu: id,
      ...(dataChange as Partial<IUpdateBrand>)
    } as IUpdateBrand

    loadingContext?.show()

    dispatch(updateBrand(finalPayload))
      .unwrap()
      .then(() => {
        reset()
        return dispatch(brandActions.setRefreshList(true))
      })
      .catch((error) => {
        // handle error nếu cần
      })
      .finally(() => {
        loadingContext?.hide()
      })
  }

  const handCreateBrand = (payload: IAddBrandReq) => {
    loadingContext?.show()

    dispatch(createBrand(payload))
      .unwrap()
      .then(() => {
        reset()
        return dispatch(brandActions.setRefreshList(true))
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
                name='TenThuongHieu'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex flex-col gap-2'>
                      <Label htmlFor='number'>
                        {t('brand_page_table_name')}
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
                      <Label> {t('brand_page_table_description')}</Label>
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

export default FormBrand
