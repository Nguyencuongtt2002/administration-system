import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common'
import { MenuTable } from '@/components/module/Menu'
import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'

const SlidePage = () => {
  const { t } = useTranslation()
  return (
    <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
      <div className='space-y-2'>
        <Card x-chunk='dashboard-06-chunk-0'>
          <CardHeader>
            <CardTitle>{t('slide_page')}</CardTitle>
            <CardDescription>{t('slide_page_title')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense>
              <MenuTable />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

export default SlidePage
