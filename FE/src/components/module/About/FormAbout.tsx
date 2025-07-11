import { TFunction } from 'i18next'
import { z } from 'zod'
import { toast } from 'sonner'
import { Trash, Upload } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useContext, useEffect, useState, Dispatch, SetStateAction, useRef } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { EMPTY_STRING } from '@/utils/constants/common'
import { useAppDispatch } from '@/utils/redux/hooks'
import { compareDataUpdate } from '@/utils/helper/common'
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
  Textarea
} from '@/components/common'
import { IAddAboutReq, IListAbout, IUpdateAbout } from '@/utils/interface/about'
import { createAbout, getAboutDetails, updateAbout } from '@/thunks/about/aboutThunk'
import { uploadSingleFile } from '@/thunks/file/fileThunk'
import { IUploadSingleFileParams } from '@/utils/interface/common'
import { aboutActions } from '@/thunks/about/aboutSlice'

type Props = {
  isOpen: boolean
  id: string
  setId: Dispatch<SetStateAction<string>>
  onClose: () => void
}

const schema = (t: TFunction) =>
  z.object({
    TieuDe: z.string().trim().optional(),
    NoiDung: z.string().min(1, t('common_validate_require_field')),
    HinhAnh: z.string().optional()
  })

const FormAbout = (props: Props) => {
  const { id, setId, isOpen, onClose } = props

  const { t } = useTranslation()
  const form = useForm<IAddAboutReq>({
    resolver: zodResolver(schema(t)),
    defaultValues: {
      TieuDe: EMPTY_STRING,
      NoiDung: EMPTY_STRING,
      HinhAnh: EMPTY_STRING
    }
  })

  const loadingContext = useContext(LoadingData)
  const dispatch = useAppDispatch()
  const avatarInputRef = useRef<HTMLInputElement | null>(null)

  const [dataOriginal, setDataOriginal] = useState<IListAbout>({} as IListAbout)
  const [previewImage, setPreviewImage] = useState(EMPTY_STRING)
  const [dataImage, setDataImage] = useState<string>(EMPTY_STRING)

  useEffect(() => {
    if (!id) {
      form.reset({
        TieuDe: EMPTY_STRING,
        NoiDung: EMPTY_STRING,
        HinhAnh: EMPTY_STRING
      })
      return
    }

    handleDetailAbout(id)
  }, [id])

  const handleDetailAbout = (id: string) => {
    if (!id) return

    loadingContext?.show()

    dispatch(getAboutDetails(id))
      .unwrap()
      .then((res) => {
        const { data } = res

        form.reset({
          TieuDe: data?.TieuDe || EMPTY_STRING,
          NoiDung: data?.NoiDung || EMPTY_STRING
        })
        setPreviewImage(data?.HinhAnh ? `http://localhost:8080/images/gioithieu/${data.HinhAnh}` : EMPTY_STRING)
        setDataImage(data?.HinhAnh || EMPTY_STRING)
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
    setPreviewImage(EMPTY_STRING)
    setDataImage(EMPTY_STRING)
  }

  const onSubmit = (data: IAddAboutReq) => {
    if (id) {
      const payload: IUpdateAbout = {
        ...data,
        HinhAnh: dataImage || EMPTY_STRING,
        MaGioiThieu: id
      }
      return handeleEditAbout(payload)
    } else {
      const dataCreate: IAddAboutReq = {
        ...data,
        HinhAnh: dataImage || EMPTY_STRING
      }
      return handCreateAbout(dataCreate)
    }
  }

  const handeleEditAbout = (data: IAddAboutReq) => {
    if (!id) return

    const dataChange = compareDataUpdate(dataOriginal as IListAbout, data)

    const finalPayload = {
      MaGioiThieu: id,
      ...(dataChange as Partial<IUpdateAbout>)
    } as IUpdateAbout

    loadingContext?.show()

    dispatch(updateAbout(finalPayload))
      .unwrap()
      .then(() => {
        reset()
        return dispatch(aboutActions.setRefreshList(true))
      })
      .catch((error) => {})
      .finally(() => {
        loadingContext?.hide()
      })
  }

  const handCreateAbout = (payload: IAddAboutReq) => {
    loadingContext?.show()

    dispatch(createAbout(payload))
      .unwrap()
      .then(() => {
        reset()
        return dispatch(aboutActions.setRefreshList(true))
      })
      .catch((error) => {
        // handle error nếu cần
      })
      .finally(() => {
        loadingContext?.hide()
      })
  }

  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>, fieldOnChange: (value: string) => void) => {
    const file = e.target.files?.[0]
    if (!file) return

    const payload: IUploadSingleFileParams = {
      file,
      folderType: 'gioithieu'
    }

    dispatch(uploadSingleFile(payload))
      .unwrap()
      .then((res) => {
        if (res && res.data) {
          const imageUrl = `http://localhost:8080/images/gioithieu/${res.data.fileName}`
          fieldOnChange(imageUrl)
          setPreviewImage(imageUrl)
          setDataImage(res.data.fileName)
          toast.success(t('common_upload_success'))
        }
      })
      .catch((err) => {})
      .finally(() => {})
  }

  const handleRemoveImage = (fieldOnChange: (value: string) => void) => {
    setPreviewImage(EMPTY_STRING)
    setDataImage(EMPTY_STRING)
    fieldOnChange(EMPTY_STRING)
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
                name='TieuDe'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex flex-col gap-2'>
                      <Label>{t('about_page_table_title')}</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input type='text' className='w-full' {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='NoiDung'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex flex-col gap-2'>
                      <Label>
                        {t('about_page_table_content')}
                        <span className='text-red-500'>*</span>
                      </Label>
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

              <FormField
                control={form.control}
                name='HinhAnh'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex flex-col gap-2'>
                      <Label>{t('about_page_table_image')}</Label>
                      <div className='flex gap-2 items-start justify-start'>
                        <div className='relative'>
                          <Avatar className='aspect-square w-[100px] h-[100px] rounded-md object-cover'>
                            <AvatarImage src={previewImage} />
                            <AvatarFallback className='rounded-none'>{t('about_page_table_image')}</AvatarFallback>
                          </Avatar>

                          {previewImage && (
                            <button
                              type='button'
                              onClick={() => handleRemoveImage(field.onChange)}
                              className='absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 shadow '
                            >
                              <Trash className='w-5 h-5 text-red-200 hover:text-red-500 cursor-pointer' />
                            </button>
                          )}
                        </div>

                        <input
                          type='file'
                          accept='image/*'
                          ref={avatarInputRef}
                          onChange={(e) => handleSelectImage(e, field.onChange)}
                          className='hidden'
                        />
                        <button
                          type='button'
                          onClick={() => avatarInputRef.current?.click()}
                          className='flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed'
                        >
                          <Upload className='h-4 w-4 text-muted-foreground' />
                          <span className='sr-only'>Upload</span>
                        </button>
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

export default FormAbout
