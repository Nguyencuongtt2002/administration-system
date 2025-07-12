import { TFunction } from 'i18next'
import { z } from 'zod'
import { toast } from 'sonner'
import { Trash, Upload } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useContext, useEffect, useState, Dispatch, SetStateAction, useRef } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { EMPTY_STRING, NUMBER_ONE } from '@/utils/constants/common'
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
import { IAddSlideReq, IListSlide, IUpdateSlide } from '@/utils/interface/slide'
import { createSlide, getSlideDetails, updateSlide } from '@/thunks/slide/slideThunk'
import { uploadSingleFile } from '@/thunks/file/fileThunk'
import { IUploadSingleFileParams } from '@/utils/interface/common'
import { slideActions } from '@/thunks/slide/slideSlice'

type Props = {
  isOpen: boolean
  id: string
  setId: Dispatch<SetStateAction<string>>
  onClose: () => void
}

const schema = (t: TFunction) =>
  z.object({
    Anh: z.string().min(NUMBER_ONE, t('common_validate_require_field'))
  })

const FormSlide = (props: Props) => {
  const { id, setId, isOpen, onClose } = props

  const { t } = useTranslation()
  const form = useForm<IAddSlideReq>({
    resolver: zodResolver(schema(t)),
    defaultValues: {
      Anh: EMPTY_STRING
    }
  })

  const loadingContext = useContext(LoadingData)
  const dispatch = useAppDispatch()
  const avatarInputRef = useRef<HTMLInputElement | null>(null)

  const [dataOriginal, setDataOriginal] = useState<IListSlide>({} as IListSlide)
  const [previewImage, setPreviewImage] = useState(EMPTY_STRING)
  const [dataImage, setDataImage] = useState<string>(EMPTY_STRING)

  useEffect(() => {
    if (!id) {
      form.reset({
        Anh: EMPTY_STRING
      })
      return
    }

    handleDetailSlide(id)
  }, [id])

  const handleDetailSlide = (id: string) => {
    if (!id) return

    loadingContext?.show()

    dispatch(getSlideDetails(id))
      .unwrap()
      .then((res) => {
        const { data } = res

        setPreviewImage(data?.Anh ? `http://localhost:8080/images/slide/${data.Anh}` : EMPTY_STRING)
        setDataImage(data?.Anh || EMPTY_STRING)
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

  const onSubmit = (data: IAddSlideReq) => {
    if (id) {
      const payload: IUpdateSlide = {
        ...data,
        Anh: dataImage || EMPTY_STRING,
        MaSlide: id
      }
      return handeleEditSlide(payload)
    } else {
      const dataCreate: IAddSlideReq = {
        ...data,
        Anh: dataImage || EMPTY_STRING
      }
      return handCreateSlide(dataCreate)
    }
  }

  const handeleEditSlide = (data: IAddSlideReq) => {
    if (!id) return

    const dataChange = compareDataUpdate(dataOriginal as IListSlide, data)

    const finalPayload = {
      MaSlide: id,
      ...(dataChange as Partial<IUpdateSlide>)
    } as IUpdateSlide

    loadingContext?.show()

    dispatch(updateSlide(finalPayload))
      .unwrap()
      .then(() => {
        reset()
        return dispatch(slideActions.setRefreshList(true))
      })
      .catch((error) => {})
      .finally(() => {
        loadingContext?.hide()
      })
  }

  const handCreateSlide = (payload: IAddSlideReq) => {
    loadingContext?.show()

    dispatch(createSlide(payload))
      .unwrap()
      .then(() => {
        reset()
        return dispatch(slideActions.setRefreshList(true))
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
      folderType: 'slide'
    }

    dispatch(uploadSingleFile(payload))
      .unwrap()
      .then((res) => {
        if (res && res.data) {
          const imageUrl = `http://localhost:8080/images/slide/${res.data.fileName}`
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
                name='Anh'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex flex-col gap-2'>
                      <Label>{t('slide_page_table_image')}</Label>
                      <div className='flex gap-2 items-start justify-start'>
                        <div className='relative'>
                          <Avatar className='aspect-square w-[100px] h-[100px] rounded-md object-cover'>
                            <AvatarImage src={previewImage} />
                            <AvatarFallback className='rounded-none'>{t('slide_page_table_image')}</AvatarFallback>
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

export default FormSlide
