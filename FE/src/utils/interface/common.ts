import { LucideProps } from 'lucide-react'
import { ForwardRefExoticComponent, RefAttributes } from 'react'
import { RoleEnum } from '@/utils/enum/common'

export interface IQueryBase {
  current: number
  pageSize: number
  searchKey?: string
}

export interface IMenuItem {
  title: string
  Icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>
  href: string
  roles: RoleEnum[]
}

export interface IUploadSingleFileParams {
  file: File
  folderType: string
}
