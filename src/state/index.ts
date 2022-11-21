import { configureStore } from '@reduxjs/toolkit'
import poolsReducer from './pools'

export default configureStore({
    devTools: process.env.NODE_ENV !== 'production',
    reducer: {
      pools: poolsReducer,
    },
})