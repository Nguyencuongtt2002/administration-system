export interface IListContact {
  MaLienHe: string
  Email: string
  DiaChi: string
  SoDienThoai: string
}

export interface IAddContactReq {
  Email: string
  DiaChi: string
  SoDienThoai: string
}

export interface IUpdateContact extends IAddContactReq {
  MaLienHe: string
}
