import { TFunction } from 'i18next'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { useContext, useEffect, useState, Dispatch, SetStateAction } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
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
  Label
} from '@/components/common'

import { EMPTY_STRING, NUMBER_ONE } from '@/utils/constants/common'
import { useAppDispatch } from '@/utils/redux/hooks'
import { compareDataUpdate } from '@/utils/helper/common'

import { IAddMenuReq, IListMenu, IUpdateMenu } from '@/utils/interface/menu'
import { createMenu, getMenuDetails, updateMenu } from '@/thunks/menu/menuThunk'
import { menuActions } from '@/thunks/menu/menuSlice'

type Props = {
  isOpen: boolean
  id: string
  setId: Dispatch<SetStateAction<string>>
  onClose: () => void
}

const schema = (t: TFunction) =>
  z.object({
    TenMenu: z.string().trim().min(NUMBER_ONE, t('common_validate_require_field')),
    Link: z.string().trim().min(NUMBER_ONE, t('common_validate_require_field'))
  })

const FormMenu = (props: Props) => {
  const { id, setId, isOpen, onClose } = props

  const { t } = useTranslation()
  const form = useForm<IAddMenuReq>({
    resolver: zodResolver(schema(t)),
    defaultValues: {
      TenMenu: EMPTY_STRING,
      Link: EMPTY_STRING
    }
  })
  const loadingContext = useContext(LoadingData)
  const dispatch = useAppDispatch()

  const [dataOriginal, setDataOriginal] = useState<IListMenu>()

  useEffect(() => {
    if (!id) {
      form.reset({
        TenMenu: EMPTY_STRING,
        Link: EMPTY_STRING
      })
      return
    }

    handleDetailMenu(id)
  }, [id])

  const handleDetailMenu = (id: string) => {
    if (!id) return

    loadingContext?.show()

    dispatch(getMenuDetails(id))
      .unwrap()
      .then((res) => {
        const { data } = res

        form.reset({
          TenMenu: data?.TenMenu || EMPTY_STRING,
          Link: data?.Link || EMPTY_STRING
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

  const onSubmit = (data: IAddMenuReq) => {
    if (id) {
      const payload: IUpdateMenu = {
        ...data,
        MaMenu: id
      }
      return handeleEditMenu(payload)
    } else {
      return handCreateMenu(data)
    }
  }

  const handeleEditMenu = (data: IAddMenuReq) => {
    if (!id) return

    const dataChange = compareDataUpdate(dataOriginal as IListMenu, data)

    const finalPayload = {
      MaMenu: id,
      ...(dataChange as Partial<IUpdateMenu>)
    } as IUpdateMenu
    loadingContext?.show()

    dispatch(updateMenu(finalPayload))
      .unwrap()
      .then(() => {
        reset()
        return dispatch(menuActions.setRefreshList(true))
      })
      .catch((error) => {
        // handle error nếu cần
      })
      .finally(() => {
        loadingContext?.hide()
      })
  }

  const handCreateMenu = (payload: IAddMenuReq) => {
    loadingContext?.show()

    dispatch(createMenu(payload))
      .unwrap()
      .then(() => {
        reset()
        return dispatch(menuActions.setRefreshList(true))
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
                name='TenMenu'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex flex-col gap-2'>
                      <Label>
                        {t('menu_page_table_menu_name')}
                        <span className='text-red-500'>*</span>
                      </Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input type='email' className='w-full' {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='Link'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex flex-col gap-2'>
                      <Label>
                        {t('menu_page_table_link')}
                        <span className='text-red-500'>*</span>
                      </Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input type='text' className='w-full' {...field} />
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

export default FormMenu
