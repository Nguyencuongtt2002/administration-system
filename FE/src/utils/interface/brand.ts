export interface IListBrand {
  MaThuongHieu: string;
  TenThuongHieu: string;
  GioiThieu: string;
}

export interface IAddBrandReq {
  TenThuongHieu: string;
  GioiThieu?: string;
}

export interface IUpdateBrand extends IAddBrandReq {
  MaThuongHieu: string;
}
