import { Suspense, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { BrandTable } from '@/components/module/Brand'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common'

const BrandPage = () => {
  const { t } = useTranslation()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://vietnam-administrative-division-json-server-swart.vercel.app/province')
        const data = await response.json()
        console.log(data) // Kết quả sẽ là mảng 63 tỉnh/thành
      } catch (error) {
        console.error('Error:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
      <div className='space-y-2'>
        <Card x-chunk='dashboard-06-chunk-0'>
          <CardHeader>
            <CardTitle>{t('brand_page')}</CardTitle>
            <CardDescription>{t('brand_page_title')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense>
              <BrandTable />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

export default BrandPage
