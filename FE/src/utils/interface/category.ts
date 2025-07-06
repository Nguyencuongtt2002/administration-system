export interface IListCategory {
  MaLoaiSanPham: string;
  TenLoaiSanPham: string;
  GioiThieu: string;
}

export interface IAddCategoryReq {
  TenLoaiSanPham: string;
  GioiThieu?: string;
}

export interface IUpdateCategory extends IAddCategoryReq {
  MaLoaiSanPham: string;
}
