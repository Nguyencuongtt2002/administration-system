export interface IListAbout {
  MaGioiThieu: string
  TieuDe?: string
  NoiDung: string
  HinhAnh?: string
}

export interface IAddAboutReq {
  TieuDe?: string
  NoiDung: string
  HinhAnh?: string
}

export interface IUpdateAbout extends IAddAboutReq {
  MaGioiThieu: string
}
