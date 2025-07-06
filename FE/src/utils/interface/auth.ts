import { IBaseResponse } from './base'

export interface IBodyLogin {
  Email: string
  MatKhau: string
}

export interface IResponseLogin {
  access_token: string
  user: IAccount
  refreshToken: string
}

export interface IAccount {
  AnhDaiDien: string | null
  DiaChi: string | null
  Email: string
  HoTen: string
  MaNguoiDung: number
  SoDienThoai: string | null
  TaiKhoan: string
  VaiTro: string
}

export type RefreshTokenReponse = IBaseResponse<{ access_token: string; refreshToken: string }>

export interface IBodyRegister {
  TaiKhoan: string
  Email: string
  MatKhau: string
  HoTen: string
}

export interface IBodyCodeActive {
  MaNguoiDung: string
  code: string
}
