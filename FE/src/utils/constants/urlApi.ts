export const urlApiAuth = {
  login: '/v1/auth/login',
  register: '/v1/auth/register',
  handleCheckCode: '/v1/auth/check-code',
  handleResendCode: '/v1/auth/resend-code',
  handleRetryActive: '/v1/auth/retry-active'
}

export const urlApiMessage = {
  fetchMessages: `/v1/chat/messages`
}

export const urlApiCategory = {
  getAll: '/v1/loaisanpham',
  createCategory: '/v1/loaisanpham',
  getCategoryDetails: (id: string) => `/v1/loaisanpham/${id}`,
  updateCategory: '/v1/loaisanpham',
  deleteCategory: (id: string) => `/v1/loaisanpham/${id}`
}

export const urlApiBrand = {
  getAll: '/v1/thuonghieu',
  createBrand: '/v1/thuonghieu',
  getBrandDetails: (id: string) => `/v1/thuonghieu/${id}`,
  updateBrand: '/v1/thuonghieu',
  deleteBrand: (id: string) => `/v1/thuonghieu/${id}`
}

export const urlApiUser = {
  findAllExcluding: '/v1/users/exclude-self'
}

export const urlApiContact = {
  getAll: '/v1/lienhe',
  createContact: '/v1/lienhe',
  getContactDetails: (id: string) => `/v1/lienhe/${id}`,
  updateContact: '/v1/lienhe',
  deleteContact: (id: string) => `/v1/lienhe/${id}`
}

export const urlApiMenu = {
  getAll: '/v1/menu',
  createMenu: '/v1/menu',
  getMenuDetails: (id: string) => `/v1/menu/${id}`,
  updateMenu: '/v1/menu',
  deleteMenu: (id: string) => `/v1/menu/${id}`
}

export const urlApiUploadSingle = {
  uploadSingle: '/v1/files/upload'
}

export const urlApiAbout = {
  getAll: '/v1/gioithieu',
  createAbout: '/v1/gioithieu',
  getAboutDetails: (id: string) => `/v1/gioithieu/${id}`,
  updateAbout: '/v1/gioithieu',
  deleteAbout: (id: string) => `/v1/gioithieu/${id}`
}

export const urlApiSlide = {
  getAll: '/v1/Slide',
  createSlide: '/v1/slide',
  getSlideDetails: (id: string) => `/v1/Slide/${id}`,
  updateSlide: '/v1/Slide',
  deleteSlide: (id: string) => `/v1/Slide/${id}`
}
