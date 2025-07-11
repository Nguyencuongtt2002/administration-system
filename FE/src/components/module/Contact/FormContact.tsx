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
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/common'

import { EMPTY_STRING, NUMBER_ONE, REGEX } from '@/utils/constants/common'
import { useAppDispatch } from '@/utils/redux/hooks'
import { compareDataUpdate, formatPhoneNumber } from '@/utils/helper/common'

import { IAddContactReq, IListContact, IUpdateContact } from '@/utils/interface/contact'
import { createContact, getContactDetails, updateContact } from '@/thunks/contact/contactThunk'
import { contactActions } from '@/thunks/contact/contactSlice'

type Props = {
  isOpen: boolean
  id: string
  setId: Dispatch<SetStateAction<string>>
  onClose: () => void
}

const schema = (t: TFunction) =>
  z.object({
    Email: z
      .string()
      .trim()
      .min(NUMBER_ONE, t('common_validate_require_field'))
      .email(t('common_validate_email_invalid')),
    DiaChi: z.string().trim().min(NUMBER_ONE, t('common_validate_require_field')),
    SoDienThoai: z.string().trim().min(NUMBER_ONE, t('common_validate_require_field'))
  })

const FormContact = (props: Props) => {
  const { id, setId, isOpen, onClose } = props

  const { t } = useTranslation()
  const form = useForm<IAddContactReq>({
    resolver: zodResolver(schema(t)),
    defaultValues: {
      Email: EMPTY_STRING,
      DiaChi: EMPTY_STRING,
      SoDienThoai: EMPTY_STRING
    }
  })
  const loadingContext = useContext(LoadingData)
  const dispatch = useAppDispatch()

  const [dataOriginal, setDataOriginal] = useState<IListContact>()
  const [provinces, setProvinces] = useState<{ idProvince: string; name: string }[]>([])

  useEffect(() => {
    if (!id) {
      form.reset({
        Email: EMPTY_STRING,
        DiaChi: EMPTY_STRING,
        SoDienThoai: EMPTY_STRING
      })
      return
    }

    handleDetailCategory(id)
  }, [id])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://vietnam-administrative-division-json-server-swart.vercel.app/province')
        const data = await response.json()
        setProvinces(data)
      } catch (error) {
        console.error('Error fetching provinces:', error)
      }
    }

    fetchData()
  }, [])

  const handleDetailCategory = (id: string) => {
    if (!id) return

    loadingContext?.show()

    dispatch(getContactDetails(id))
      .unwrap()
      .then((res) => {
        const { data } = res

        form.reset({
          Email: data?.Email || EMPTY_STRING,
          DiaChi: data?.DiaChi || EMPTY_STRING,
          SoDienThoai: data?.SoDienThoai || EMPTY_STRING
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

  const onSubmit = (data: IAddContactReq) => {
    if (id) {
      const payload: IUpdateContact = {
        ...data,
        MaLienHe: id
      }

      return handeleEditContact(payload)
    } else {
      return handCreateContact(data)
    }
  }

  const handeleEditContact = (data: IAddContactReq) => {
    if (!id) return

    const formattedData: IAddContactReq = {
      ...data,
      ...(data.SoDienThoai && { SoDienThoai: data.SoDienThoai?.replace(REGEX.number, EMPTY_STRING) })
    }

    const dataChange = compareDataUpdate(dataOriginal as IListContact, formattedData)

    const finalPayload = {
      MaLienHe: id,
      ...(dataChange as Partial<IUpdateContact>)
    } as IUpdateContact

    loadingContext?.show()

    dispatch(updateContact(finalPayload))
      .unwrap()
      .then(() => {
        reset()
        return dispatch(contactActions.setRefreshList(true))
      })
      .catch((error) => {
        // handle error nếu cần
      })
      .finally(() => {
        loadingContext?.hide()
      })
  }

  const handCreateContact = (payload: IAddContactReq) => {
    const formattedData: IAddContactReq = {
      ...payload,
      SoDienThoai: payload.SoDienThoai?.replace(REGEX.number, EMPTY_STRING)
    }
    loadingContext?.show()

    dispatch(createContact(formattedData))
      .unwrap()
      .then(() => {
        reset()
        return dispatch(contactActions.setRefreshList(true))
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
                name='Email'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex flex-col gap-2'>
                      <Label>
                        {t('contact_page_table_email')}
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
                name='DiaChi'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex flex-col gap-2'>
                      <Label>
                        {t('contact_page_table_address')}
                        <span className='text-red-500'>*</span>
                      </Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className='w-full'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {provinces.map((province) => (
                              <SelectItem key={province.idProvince} value={province.name}>
                                {province.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='SoDienThoai'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex flex-col gap-2'>
                      <Label>
                        {t('contact_page_table_phone')}
                        <span className='text-red-500'>*</span>
                      </Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input
                          type='text'
                          className='w-full'
                          value={field.value ? formatPhoneNumber(field.value) : EMPTY_STRING}
                          onChange={(event) => {
                            const { value } = event.target
                            const formattedValue = formatPhoneNumber(value)
                            field.onChange(formattedValue)
                            form.setValue(field.name, formattedValue)
                          }}
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

export default FormContact
