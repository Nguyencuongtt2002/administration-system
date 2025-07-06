import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import SwitchLanguage from '@/components/switch-language'
import { ModeToggle } from '@/components/mode-toggle'
import { IBodyLogin } from '@/utils/interface/auth'
import { useAppDispatch } from '@/utils/redux/hooks'
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authActions } from '@/thunks/auth/authSlice'
import { handleLogin } from '@/thunks/auth/authThunk'
import { RoleEnum } from '@/utils/enum/common'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import http from '@/apis/axios.customize'
import { LoadingData } from '@/components/common'
import { EMPTY_STRING } from '@/utils/constants/common'

const loginSchema = z.object({
  Email: z.string().email('Email không hợp lệ'),
  MatKhau: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
})

const LoginForm = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const loadingContext = useContext(LoadingData)
  const navigate = useNavigate()
  const form = useForm<IBodyLogin>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      Email: '',
      MatKhau: ''
    }
  })

  const onSubmit = async (data: IBodyLogin) => {
    loadingContext?.show()

    dispatch(handleLogin(data))
      .unwrap()
      .then((res) => {
        const { user, access_token } = res?.data
        dispatch(authActions.setAccessToken(access_token))

        if (user.VaiTro == RoleEnum.ADMIN) {
          navigate('/')
        }
      })
      .catch((err) => {})
      .finally(() => {
        loadingContext?.hide()
      })
  }

  const handleGoogleLogin = async () => {
    try {
      const response = await http.get('/v1/auth/google-link')
      // Redirect to Google auth page
      window.location.href = response.data.data.url
    } catch {}
  }

  return (
    <div className='flex items-center justify-center min-h-screen px-4 relative'>
      <header className='top-4 right-4 absolute space-x-4 flex'>
        <SwitchLanguage />
        <ModeToggle />
      </header>
      <Card className='w-full max-w-md shadow-lg rounded-2xl'>
        <CardHeader className='text-center'>
          <CardTitle className='text-3xl font-semibold'>{t('welcomeBack')}</CardTitle>
          <CardDescription className='text-gray-500'>{t('enterCredentials')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className='space-y-6' noValidate onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name='Email'
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor='Email'>{t('email')}</Label>
                    <Input
                      id='Email'
                      type='email'
                      placeholder={t('emailPlaceholder')}
                      required
                      className='mt-1'
                      {...field}
                    />
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
                    <Input
                      id='MatKhau'
                      type='password'
                      placeholder={t('passwordPlaceholder')}
                      required
                      className='mt-1'
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type='submit' className='w-full'>
                {t('login')}
              </Button>
              <Button
                variant='outline'
                className='w-full flex items-center justify-center gap-2 cursor-pointer'
                type='button'
                onClick={handleGoogleLogin}
              >
                <img src='https://www.svgrepo.com/show/475656/google-color.svg' alt='Google' className='w-5 h-5' />
                {t('signInWithGoogle')}
              </Button>

              <div className='text-center pt-2'>
                <span className='text-sm text-muted-foreground'>{t('noAccount')} </span>
                <Button
                  variant='link'
                  type='button'
                  className='p-0 h-auto text-sm font-medium'
                  onClick={() => navigate('/register')}
                >
                  {t('signUp')}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginForm
