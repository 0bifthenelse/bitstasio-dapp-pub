import { configureStore } from '@reduxjs/toolkit';
import reducer_web3 from './slice/web3';
import reducer_mining from './slice/mining';
import reducer_activity from './slice/activity';
import reducer_currency from './slice/currency';
import reducer_loading from './slice/loading';
import reducer_page from './slice/page';
import reducer_calculator from './slice/calculator';

export default configureStore({
  reducer: {
    page: reducer_page,
    loading: reducer_loading,
    currency: reducer_currency,
    web3: reducer_web3,
    mining: reducer_mining,
    activity: reducer_activity,
    calculator: reducer_calculator
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }),
});