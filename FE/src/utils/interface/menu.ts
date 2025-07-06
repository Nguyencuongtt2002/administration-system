export interface IListMenu {
  MaMenu: string
  TenMenu: string
  Link: string
}

export interface IAddMenuReq {
  TenMenu: string
  Link: string
}

export interface IUpdateMenu extends IAddMenuReq {
  MaMenu: string
}
