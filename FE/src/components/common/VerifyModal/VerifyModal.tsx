import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

const verifySchema = z.object({
  MaNguoiDung: z.string(), // ẩn
  code: z.string().min(1, 'Vui lòng nhập mã xác thực')
})

interface Props {
  id: string
  open: boolean
  onClose: () => void
}

export default function VerifyModal({ id, open, onClose }: Props) {
  const form = useForm({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      MaNguoiDung: id,
      code: ''
    }
  })

  const navigate = useNavigate()

  const onSubmit = (values: any) => {
    console.log('Form Submit:', values)
    // Gọi API xác thực ở đây
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-md px-0'>
        <Card className='shadow-none border-none'>
          <CardContent className='p-6'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
                <DialogHeader className='text-center mb-3'>
                  <DialogTitle className='text-xl font-semibold'>Kích hoạt tài khoản</DialogTitle>
                  <DialogDescription>
                    Mã xác thực đã được gửi tới email đăng ký. Vui lòng kiểm tra email của bạn.
                  </DialogDescription>
                </DialogHeader>

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
                      <FormLabel>Mã xác thực</FormLabel>
                      <Input placeholder='Nhập mã xác thực' {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type='submit' className='w-full'>
                  Xác nhận
                </Button>

                <Separator className='my-4' />

                <div className='text-center'>
                  <Link to='/' className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:underline'>
                    <ArrowLeft className='w-4 h-4' /> Quay lại trang chủ
                  </Link>
                </div>

                <div className='text-center mt-2 text-sm'>
                  Đã có tài khoản?{' '}
                  <Link to='/auth/login' className='text-blue-600 hover:underline'>
                    Đăng nhập
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
