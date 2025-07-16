export interface IListSize {
  MaSize: string
  TenSize: string
  MoTa: string
}

export interface IAddSizeReq {
  TenSize: string
  MoTa: string
}

export interface IUpdateSize extends IAddSizeReq {
  MaSize: string
}
