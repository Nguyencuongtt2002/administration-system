import { urlApiUploadSingle } from '@/utils/constants/urlApi'
import http from './axios.customize'
import { IBaseResponse } from '@/utils/interface/base'
import { IUploadSingleFileParams } from '@/utils/interface/common'
import { IUploadSingleFile } from '@/utils/interface/file'

const fileApi = {
  uploadSingleFile(data: IUploadSingleFileParams) {
    const url = `${urlApiUploadSingle.uploadSingle}`
    const formData = new FormData()
    formData.append('fileUpload', data.file)

    return http.post<IBaseResponse<IUploadSingleFile>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        folder_type: data.folderType
      }
    })
  }
}

export default fileApi
