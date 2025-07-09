import { useContext, useEffect, useState } from 'react'
import { useForm, useFormContext, useWatch } from 'react-hook-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useAppDispatch } from '@/utils/redux/hooks'
import { LoadingData } from '@/components/common/Loading/LoadingData'
import { toast } from 'sonner'
import { handleCheckCode, handleRetryActive } from '@/thunks/auth/authThunk'
import { IBodyCodeActive } from '@/utils/interface/auth'
import { EMPTY_STRING, NUMBER_ZERO } from '@/utils/constants/common'

type Props = {
  isModalOpen: boolean
  setIsModalOpen: (val: boolean) => void
}

const ModalReactive = ({ isModalOpen, setIsModalOpen }: Props) => {
  const { control } = useFormContext()
  const dispatch = useAppDispatch()
  const loadingContext = useContext(LoadingData)
  const userEmail = useWatch({ control, name: 'Email' })

  const [current, setCurrent] = useState<number>(NUMBER_ZERO)
  const [userId, setUserId] = useState<string>(EMPTY_STRING)

  const formStep0 = useForm<{ Email: string }>({
    defaultValues: { Email: userEmail }
  })

  const formStep1 = useForm<IBodyCodeActive>({
    defaultValues: {
      code: EMPTY_STRING,
      MaNguoiDung: EMPTY_STRING
    }
  })

  useEffect(() => {
    if (userEmail) {
      formStep0.setValue('Email', userEmail)
    }
  }, [userEmail])

  const onFinishStep0 = async (data: { Email: string }) => {
    const { Email } = data

    loadingContext?.show()

    dispatch(handleRetryActive({ Email }))
      .unwrap()
      .then((res) => {
        toast.success('Mã đã được gửi đến Email. Vui lòng check Email!')
        setCurrent(1)
        setUserId(res?.data.MaNguoiDung)
      })
      .catch((err) => {})
      .finally(() => {
        loadingContext?.hide()
      })
  }

  const onFinishStep1 = (values: IBodyCodeActive) => {
    loadingContext?.show()

    const payload = {
      ...values,
      MaNguoiDung: userId
    }

    dispatch(handleCheckCode(payload))
      .unwrap()
      .then((res) => {
        toast.success('Kích hoạt tài khoản thành công.')
        setCurrent(2)
      })
      .catch((err) => {})
      .finally(() => {
        loadingContext?.hide()
      })
  }

  const StepIndicator = () => (
    <div className='flex justify-between mb-6'>
      {['Gửi lại', 'Xác minh', 'Hoàn tất'].map((label, index) => (
        <div key={index} className='flex flex-col items-center flex-1'>
          <div
            className={cn(
              'rounded-full w-8 h-8 flex items-center justify-center text-white',
              current >= index ? 'bg-blue-600' : 'bg-gray-300'
            )}
          >
            {index + 1}
          </div>
          <span className='mt-1 text-sm'>{label}</span>
        </div>
      ))}
    </div>
  )

  return (
    <Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Kích hoạt tài khoản</DialogTitle>
        </DialogHeader>

        <StepIndicator />

        {current === 0 && (
          <form onSubmit={formStep0.handleSubmit(onFinishStep0)} className='space-y-4'>
            <p className='text-sm text-muted-foreground'>Tài khoản của bạn chưa được kích hoạt</p>
            <Input disabled {...formStep0.register('Email')} value={userEmail} />
            <Button type='submit' className='w-full'>
              Gửi lại mã
            </Button>
          </form>
        )}

        {current === 1 && (
          <form onSubmit={formStep1.handleSubmit(onFinishStep1)} className='space-y-4'>
            <p className='text-sm text-muted-foreground'>Nhập mã xác minh đã gửi đến email</p>
            <Input
              {...formStep1.register('code', {
                required: 'Vui lòng nhập mã xác nhận'
              })}
              placeholder='Nhập mã xác nhận'
            />
            <Button type='submit' className='w-full'>
              Xác minh
            </Button>
          </form>
        )}

        {current === 2 && (
          <div className='text-center py-4'>
            <p className='text-sm text-green-600 font-medium'>
              Tài khoản của bạn đã được kích hoạt thành công. Vui lòng đăng nhập lại.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ModalReactive
