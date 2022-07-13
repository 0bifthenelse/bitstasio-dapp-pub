import { configureStore } from '@reduxjs/toolkit';
import reducer_web3 from './slice/web3';
import reducer_mining from './slice/mining';

export default configureStore({
  reducer: {
    web3: reducer_web3,
    mining: reducer_mining,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }),
});