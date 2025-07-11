import { locales } from '@/i18n/i18n'
import { useTranslation } from 'react-i18next'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/common'

export default function SwitchLanguage() {
  const { i18n } = useTranslation()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  const currentLanguage = locales[i18n.language as keyof typeof locales]

  return (
    <Select value={currentLanguage} onValueChange={(value) => changeLanguage(value)}>
      <SelectTrigger className='w-[140px]'>
        <SelectValue placeholder='Select language' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value='en'>English</SelectItem>
          <SelectItem value='vi'>Tiếng Việt</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
