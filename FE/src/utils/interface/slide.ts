export interface IListSlide {
  MaSlide: string
  Anh: string
}

export interface IAddSlideReq {
  Anh: string
}

export interface IUpdateSlide extends IAddSlideReq {
  MaSlide: string
}
