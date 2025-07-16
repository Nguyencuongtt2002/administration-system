import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from '@/thunks/auth/authSlice'
import categoryReducer from '@/thunks/category/categorySlice'
import brandReducer from '@/thunks/brand/brandSlice'
import messageReducer from '@/thunks/message/messageSlice'
import userReducer from '@/thunks/user/userSlice'
import contactReducer from '@/thunks/contact/contactSlice'
import menuReducer from '@/thunks/menu/menuSlice'
import fileReducer from '@/thunks/file/fileSlice'
import aboutReducer from '@/thunks/about/aboutSlice'
import slideReducer from '@/thunks/slide/slideSlice'
import sizeReducer from '@/thunks/size/sizeSlice'
import notificationReducer from '@/thunks/notification/notificationSlice'

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklistt: ['app']
}
const rootReducer = combineReducers({
  auth: authReducer,
  category: categoryReducer,
  brand: brandReducer,
  message: messageReducer,
  user: userReducer,
  contact: contactReducer,
  menu: menuReducer,
  file: fileReducer,
  about: aboutReducer,
  slide: slideReducer,
  size: sizeReducer,
  notification: notificationReducer
})
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
})

export const persistor = persistStore(store)
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
