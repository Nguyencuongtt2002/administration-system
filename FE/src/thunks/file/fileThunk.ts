import fileApi from '@/apis/file'
import { UPLOAD_SINGLE_FILE } from '@/utils/constants/actionType'
import { IUploadSingleFileParams } from '@/utils/interface/common'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const uploadSingleFile = createAsyncThunk(
  UPLOAD_SINGLE_FILE,
  async (data: IUploadSingleFileParams, { rejectWithValue }) => {
    try {
      const res = await fileApi.uploadSingleFile(data)
      return res.data
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Upload failed')
    }
  }
)
