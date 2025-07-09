'use client'

import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { motion } from 'framer-motion'
import { Ghost } from 'lucide-react'

export default function NotFound() {
  return (
    <div className='flex items-center justify-center min-h-screen bg-slate-900 px-4'>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Alert className='max-w-xl mx-auto text-center bg-slate-800 text-slate-100 shadow-xl rounded-2xl p-8 border border-slate-700'>
          <div className='flex justify-center mb-4'>
            <Ghost className='w-12 h-12 text-blue-400' />
          </div>
          <AlertTitle className='text-4xl font-extrabold text-blue-400'>404 - Không Tìm Thấy</AlertTitle>
          <AlertDescription className='mt-4 text-slate-300 text-lg leading-relaxed'>
            Trang bạn tìm kiếm không tồn tại hoặc đã bị di chuyển. Hãy trở về trang chủ để tiếp tục cuộc hành trình.
          </AlertDescription>
          <div className='mt-6 flex justify-center'>
            <Button className='bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 text-base rounded-xl' asChild>
              <a href='/'>Trở về trang chủ</a>
            </Button>
          </div>
        </Alert>
      </motion.div>
    </div>
  )
}
