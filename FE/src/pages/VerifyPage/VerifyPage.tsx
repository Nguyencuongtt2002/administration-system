import { Card, CardContent } from '@/components/ui/card'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Separator } from '@/components/ui/separator'
import { useContext, useEffect, useState } from 'react'
import SwitchLanguage from '@/components/switch-language'
import { ModeToggle } from '@/components/mode-toggle'
import { IBodyCodeActive } from '@/utils/interface/auth'
import { useAppDispatch } from '@/utils/redux/hooks'
import { LoadingData } from '@/components/common'
import { handleCheckCode, handleResendCode } from '@/thunks/auth/authThunk'
import { toast } from 'sonner'
import { EMPTY_STRING, NUMBER_ONE, NUMBER_ZERO, RESEND_INTERVAL } from '@/utils/constants/common'
import { formatTimer } from '@/utils/helper/common'

const verifySchema = z.object({
  MaNguoiDung: z.string(),
  code: z.string().min(1, 'Vui lòng nhập mã xác thực')
})

export default function VerifyPage() {
  const form = useForm<IBodyCodeActive>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      MaNguoiDung: EMPTY_STRING,
      code: EMPTY_STRING
    }
  })

  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const loadingContext = useContext(LoadingData)
  const { id } = useParams<{ id: string }>()

  const [resendTimer, setResendTimer] = useState(NUMBER_ZERO)

  useEffect(() => {
    if (!id) return

    form.setValue('MaNguoiDung', id)
  }, [id])

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (resendTimer > NUMBER_ZERO) {
      timer = setTimeout(() => setResendTimer((prev) => prev - NUMBER_ONE), 1000)
    }

    return () => clearTimeout(timer)
  }, [resendTimer])

  const onSubmit = (values: IBodyCodeActive) => {
    loadingContext?.show()

    dispatch(handleCheckCode(values))
      .unwrap()
      .then((res) => {
        toast.success('Kích hoạt tài khoản thành công.')
        navigate(`/login`)
      })
      .catch((err) => {})
      .finally(() => {
        loadingContext?.hide()
      })
  }

  const handleResend = () => {
    loadingContext?.show()

    if (!id) return

    dispatch(handleResendCode({ MaNguoiDung: Number(id) }))
      .unwrap()
      .then(() => {
        toast.success('Mã xác thực đã được gửi lại.')
        setResendTimer(RESEND_INTERVAL)
      })
      .catch((err) => {})
      .finally(() => {
        loadingContext?.hide()
      })
  }

  return (
    <div className='flex items-center justify-center min-h-screen px-4 relative'>
      <header className='top-4 right-4 absolute space-x-4 flex'>
        <SwitchLanguage />
        <ModeToggle />
      </header>
      <Card className='w-full max-w-md shadow-lg rounded-xl'>
        <CardContent className='p-6'>
          <h1 className='text-xl font-semibold text-center mb-2'>Kích hoạt tài khoản</h1>
          <p className='text-sm text-center text-muted-foreground mb-6'>
            Mã xác thực đã được gửi tới email đăng ký. Vui lòng kiểm tra email của bạn.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
              <FormField
                control={form.control}
                name='MaNguoiDung'
                render={({ field }) => (
                  <FormItem className='hidden'>
                    <Input disabled {...field} />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='code'
                render={({ field }) => (
                  <FormItem>
                    <Input placeholder='Nhập mã xác thực' {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type='submit' className='w-full'>
                Xác nhận
              </Button>

              <div className='text-center mt-2'>
                <Button
                  type='button'
                  variant='link'
                  disabled={resendTimer > 0}
                  onClick={handleResend}
                  className='text-sm text-blue-600 hover:underline p-0 h-auto'
                >
                  {resendTimer > NUMBER_ZERO ? `Gửi lại sau ${formatTimer(resendTimer)}` : 'Gửi lại mã xác thực'}
                </Button>
              </div>
            </form>
          </Form>

          <Separator className='my-3' />

          <div className='text-center mt-2 text-sm'>
            Đã có tài khoản?{' '}
            <Link to='/auth/login' className='text-blue-600 hover:underline'>
              Đăng nhập
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
