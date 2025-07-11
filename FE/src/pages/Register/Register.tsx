import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { IBodyRegister } from '@/utils/interface/auth'
import { useAppDispatch } from '@/utils/redux/hooks'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Label,
  LoadingData,
  ModeToggle,
  SwitchLanguage
} from '@/components/common'
import { handleRegister } from '@/thunks/auth/authThunk'

const registerSchema = z.object({
  TaiKhoan: z.string().min(1, 'Tài khoản không được để trống'),
  HoTen: z.string().min(1, 'Họ tên không được để trống'),
  Email: z.string().email('Email không hợp lệ'),
  MatKhau: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
})

const RegisterPage = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const loadingContext = useContext(LoadingData)
  const navigate = useNavigate()

  const form = useForm<IBodyRegister>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      TaiKhoan: '',
      HoTen: '',
      Email: '',
      MatKhau: ''
    }
  })

  const onSubmit = async (values: IBodyRegister) => {
    loadingContext?.show()

    dispatch(handleRegister(values))
      .unwrap()
      .then((res) => {
        navigate(`/verify/${res.data.id}`)
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
      <Card className='w-full max-w-md shadow-lg rounded-2xl'>
        <CardHeader className='text-center'>
          <CardTitle className='text-3xl font-semibold'>{t('signUp')}</CardTitle>
          <CardDescription className='text-gray-500'>Điền thông tin để tạo tài khoản</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className='space-y-5' noValidate onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name='TaiKhoan'
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor='TaiKhoan'>Tài khoản</Label>
                    <Input id='TaiKhoan' type='text' placeholder='Nhập tài khoản' {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='HoTen'
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor='HoTen'>Họ tên</Label>
                    <Input id='HoTen' type='text' placeholder='Nhập họ tên' {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='Email'
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor='Email'>Email</Label>
                    <Input id='Email' type='email' placeholder={t('emailPlaceholder')} {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='MatKhau'
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor='MatKhau'>{t('password')}</Label>
                    <Input id='MatKhau' type='password' placeholder={t('passwordPlaceholder')} {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type='submit' className='w-full'>
                {t('signUp')}
              </Button>

              <div className='text-center pt-2'>
                <span className='text-sm text-muted-foreground'>Bạn đã có tài khoản? </span>
                <Button
                  variant='link'
                  type='button'
                  className='p-0 h-auto text-sm font-medium'
                  onClick={() => navigate('/login')}
                >
                  {t('login')}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default RegisterPage
