import { ShoppingCart, Users2, DollarSign, Salad } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const stats = [
  {
    title: 'Tổng đơn hàng',
    value: '1,234',
    icon: <ShoppingCart className='h-6 w-6 text-blue-500' />
  },
  {
    title: 'Tổng người dùng',
    value: '568',
    icon: <Users2 className='h-6 w-6 text-green-500' />
  },
  {
    title: 'Tổng doanh thu',
    value: '$12,345',
    icon: <DollarSign className='h-6 w-6 text-yellow-500' />
  },
  {
    title: 'Số món ăn',
    value: '87',
    icon: <Salad className='h-6 w-6 text-pink-500' />
  }
]

export default function AdminDashboard() {
  return (
    <div className='p-6 space-y-6'>
      <h1 className='text-2xl font-bold'>Bảng điều khiển</h1>
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {stats.map((stat, index) => (
          <Card key={index} className='shadow-sm'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
