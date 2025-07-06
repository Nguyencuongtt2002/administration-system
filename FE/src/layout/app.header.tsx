import { ModeToggle } from '@/components/mode-toggle'
import DropdownAvatar from './dropdown-avatar'
import SwitchLanguage from '@/components/switch-language'
import NotificationComponent from '@/components/NotificationComponent'
import MessageComponent from '@/components/MessageComponent'

const AppHeader = () => {
  return (
    <header className='sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6'>
      <div className='ml-auto flex items-center gap-4'>
        <SwitchLanguage />
        <ModeToggle />
        <NotificationComponent />
        <MessageComponent unreadCount={3} />
      </div>
      <DropdownAvatar />
    </header>
  )
}

export default AppHeader
